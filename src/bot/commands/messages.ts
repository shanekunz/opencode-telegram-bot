import type { CommandContext, Context } from "grammy";
import { InlineKeyboard } from "grammy";
import { opencodeClient } from "../../opencode/client.js";
import { config } from "../../config.js";
import { interactionManager } from "../../interaction/manager.js";
import { clearAllInteractionState } from "../../interaction/cleanup.js";
import { getCurrentProject, setCurrentAgent, setCurrentModel, setCurrentProject } from "../../settings/manager.js";
import { getCurrentSession, setCurrentSession, type SessionInfo } from "../../session/manager.js";
import { getStoredAgent, resolveProjectAgent } from "../../agent/manager.js";
import { getStoredModel } from "../../model/manager.js";
import { keyboardManager } from "../../keyboard/manager.js";
import { pinnedMessageManager } from "../../pinned/manager.js";
import { registerTopicSessionBinding } from "../../topic/manager.js";
import { ingestSessionInfoForCache } from "../../session/cache-manager.js";
import { safeBackgroundTask } from "../../utils/safe-background-task.js";
import { logger } from "../../utils/logger.js";
import { summaryAggregator } from "../../summary/aggregator.js";
import { renderAssistantFinalPartsSafe } from "../utils/assistant-rendering.js";
import { sendBotRenderedPart } from "../utils/telegram-text.js";
import { buildTopicMessageLink } from "../utils/topic-link.js";
import { createMainKeyboard } from "../utils/keyboard.js";
import { formatVariantForButton } from "../../variant/manager.js";
import { TOPIC_COLORS } from "../../topic/colors.js";
import { formatTopicTitle } from "../../topic/title-format.js";
import { t } from "../../i18n/index.js";
import {
  createScopeKeyFromParams,
  getScopeFromContext,
  getScopeKeyFromContext,
  getThreadSendOptions,
  SCOPE_CONTEXT,
} from "../scope.js";
import { CHAT_TYPE, TELEGRAM_CHAT_FIELD } from "../constants.js";

const MESSAGES_CALLBACK_PREFIX = "messages:";
const MESSAGES_CALLBACK_SELECT_PREFIX = `${MESSAGES_CALLBACK_PREFIX}select:`;
const MESSAGES_CALLBACK_PAGE_PREFIX = `${MESSAGES_CALLBACK_PREFIX}page:`;
const MESSAGES_CALLBACK_REVERT = `${MESSAGES_CALLBACK_PREFIX}revert`;
const MESSAGES_CALLBACK_FORK = `${MESSAGES_CALLBACK_PREFIX}fork`;
const MESSAGES_CALLBACK_BACK = `${MESSAGES_CALLBACK_PREFIX}back`;
const MESSAGES_CALLBACK_CANCEL = `${MESSAGES_CALLBACK_PREFIX}cancel`;
const MAX_INLINE_BUTTON_LABEL_LENGTH = 64;
const TELEGRAM_MESSAGE_LIMIT = 4096;
const LATEST_ASSISTANT_RESPONSE_MESSAGES_LIMIT = 20;

interface MessagesCallbackDeps {
  ensureEventSubscription: (directory: string) => Promise<void>;
}

interface UserMessageItem {
  id: string;
  text: string;
  created: number;
}

interface MessagesBaseMetadata {
  flow: "messages";
  messageId: number;
  projectId: string;
  projectDirectory: string;
  sessionId: string;
  messages: UserMessageItem[];
  page: number;
}

interface MessagesListMetadata extends MessagesBaseMetadata {
  flow: "messages";
  stage: "list";
}

interface MessagesDetailMetadata extends MessagesBaseMetadata {
  flow: "messages";
  stage: "detail";
  selectedIndex: number;
}

type MessagesMetadata = MessagesListMetadata | MessagesDetailMetadata;

type SessionMessageLike = {
  info: {
    id?: string;
    role?: string;
    summary?: boolean;
    time?: {
      created?: number;
    };
  };
  parts: Array<{ type: string; text?: string }>;
};

export interface MessagesPaginationRange {
  page: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

function getCallbackMessageId(ctx: Context): number | null {
  const message = ctx.callbackQuery?.message;
  if (!message || !("message_id" in message)) {
    return null;
  }

  return typeof message.message_id === "number" ? message.message_id : null;
}

function extractTextParts(parts: Array<{ type: string; text?: string }>): string | null {
  const text = parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text as string)
    .join("")
    .trim();

  return text.length > 0 ? text : null;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function normalizeButtonText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function formatMessageTime(created: number): string {
  const date = new Date(created);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatMessageButtonLabel(message: UserMessageItem): string {
  const prefix = `[${formatMessageTime(message.created)}] `;
  const text = normalizeButtonText(message.text);
  return `${prefix}${truncateText(text, MAX_INLINE_BUTTON_LABEL_LENGTH - prefix.length)}`;
}

function formatMessagesSelectText(page: number): string {
  return page === 0 ? t("messages.select") : t("messages.select_page", { page: page + 1 });
}

function formatMessageDetailText(message: UserMessageItem): string {
  const prefix = `[${formatMessageTime(message.created)}]\n\n`;
  return truncateText(`${prefix}${message.text}`, TELEGRAM_MESSAGE_LIMIT);
}

export function buildMessagePageCallback(page: number): string {
  return `${MESSAGES_CALLBACK_PAGE_PREFIX}${page}`;
}

export function parseMessagePageCallback(data: string): number | null {
  if (!data.startsWith(MESSAGES_CALLBACK_PAGE_PREFIX)) {
    return null;
  }

  const page = Number(data.slice(MESSAGES_CALLBACK_PAGE_PREFIX.length));
  if (!Number.isInteger(page) || page < 0) {
    return null;
  }

  return page;
}

export function calculateMessagesPaginationRange(
  totalMessages: number,
  page: number,
  pageSize: number,
): MessagesPaginationRange {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalMessages / safePageSize));
  const normalizedPage = Math.min(Math.max(0, page), totalPages - 1);
  const startIndex = normalizedPage * safePageSize;
  const endIndex = Math.min(startIndex + safePageSize, totalMessages);

  return {
    page: normalizedPage,
    totalPages,
    startIndex,
    endIndex,
  };
}

function buildMessagesListKeyboard(
  messages: UserMessageItem[],
  page: number,
  pageSize: number,
): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  const { page: normalizedPage, totalPages, startIndex, endIndex } =
    calculateMessagesPaginationRange(messages.length, page, pageSize);

  messages.slice(startIndex, endIndex).forEach((message, index) => {
    keyboard
      .text(formatMessageButtonLabel(message), `${MESSAGES_CALLBACK_SELECT_PREFIX}${startIndex + index}`)
      .row();
  });

  if (totalPages > 1) {
    if (normalizedPage > 0) {
      keyboard.text(t("messages.button.prev_page"), buildMessagePageCallback(normalizedPage - 1));
    }

    if (normalizedPage < totalPages - 1) {
      keyboard.text(t("messages.button.next_page"), buildMessagePageCallback(normalizedPage + 1));
    }

    keyboard.row();
  }

  keyboard.text(t("messages.button.cancel"), MESSAGES_CALLBACK_CANCEL);
  return keyboard;
}

function buildMessageDetailKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text(t("messages.button.revert"), MESSAGES_CALLBACK_REVERT)
    .row()
    .text(t("messages.button.fork"), MESSAGES_CALLBACK_FORK)
    .row()
    .text(t("messages.button.back"), MESSAGES_CALLBACK_BACK)
    .text(t("messages.button.cancel"), MESSAGES_CALLBACK_CANCEL);
}

function parseMessages(value: unknown): UserMessageItem[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const messages: UserMessageItem[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") {
      return null;
    }

    const id = (item as { id?: unknown }).id;
    const text = (item as { text?: unknown }).text;
    const created = (item as { created?: unknown }).created;
    if (typeof id !== "string" || typeof text !== "string" || typeof created !== "number") {
      return null;
    }

    messages.push({ id, text, created });
  }

  return messages;
}

function parseMessagesMetadata(scopeKey: string): MessagesMetadata | null {
  const state = interactionManager.getSnapshot(scopeKey);
  if (!state || state.kind !== "custom") {
    return null;
  }

  const flow = state.metadata.flow;
  const stage = state.metadata.stage;
  const messageId = state.metadata.messageId;
  const projectId = state.metadata.projectId;
  const projectDirectory = state.metadata.projectDirectory;
  const sessionId = state.metadata.sessionId;
  const messages = parseMessages(state.metadata.messages);
  const page =
    typeof state.metadata.page === "number" && Number.isInteger(state.metadata.page)
      ? Math.max(0, state.metadata.page)
      : 0;

  if (
    flow !== "messages" ||
    typeof messageId !== "number" ||
    typeof projectId !== "string" ||
    typeof projectDirectory !== "string" ||
    typeof sessionId !== "string" ||
    !messages
  ) {
    return null;
  }

  if (stage === "list") {
    return {
      flow,
      stage,
      messageId,
      projectId,
      projectDirectory,
      sessionId,
      messages,
      page,
    };
  }

  if (stage === "detail") {
    const selectedIndex = state.metadata.selectedIndex;
    if (typeof selectedIndex !== "number" || !Number.isInteger(selectedIndex) || selectedIndex < 0) {
      return null;
    }

    return {
      flow,
      stage,
      messageId,
      projectId,
      projectDirectory,
      sessionId,
      messages,
      page,
      selectedIndex,
    };
  }

  return null;
}

function clearMessagesInteraction(reason: string, scopeKey: string): void {
  if (parseMessagesMetadata(scopeKey)) {
    clearAllInteractionState(reason, scopeKey);
  }
}

async function loadUserMessages(sessionId: string, directory: string): Promise<UserMessageItem[]> {
  const { data, error } = await opencodeClient.session.messages({
    sessionID: sessionId,
    directory,
  });

  if (error || !data) {
    throw error || new Error("No message data received");
  }

  const { data: sessionData } = await opencodeClient.session.get({
    sessionID: sessionId,
    directory,
  });

  const revertMessageID = sessionData?.revert?.messageID;
  const messages = (data as SessionMessageLike[])
    .map((message) => {
      if (message.info.role !== "user") {
        return null;
      }

      const text = extractTextParts(message.parts);
      if (!text) {
        return null;
      }

      return {
        id: message.info.id ?? `${message.info.time?.created ?? 0}`,
        text,
        created: message.info.time?.created ?? 0,
      } satisfies UserMessageItem;
    })
    .filter((message): message is UserMessageItem => Boolean(message))
    .sort((left, right) => right.created - left.created);

  if (!revertMessageID) {
    return messages;
  }

  const revertIndex = messages.findIndex((message) => message.id === revertMessageID);
  return revertIndex === -1 ? messages : messages.slice(revertIndex + 1);
}

async function loadLatestAssistantResponse(
  sessionId: string,
  directory: string,
): Promise<string | null> {
  try {
    const { data: messages, error } = await opencodeClient.session.messages({
      sessionID: sessionId,
      directory,
      limit: LATEST_ASSISTANT_RESPONSE_MESSAGES_LIMIT,
    });

    if (error || !messages) {
      logger.warn("[Messages] Failed to fetch latest assistant response:", error);
      return null;
    }

    const latest = (messages as SessionMessageLike[]).reduce<{ text: string; created: number } | null>(
      (current, message) => {
        if (message.info.role !== "assistant" || message.info.summary) {
          return current;
        }

        const text = extractTextParts(message.parts);
        if (!text) {
          return current;
        }

        const created = message.info.time?.created ?? 0;
        return !current || created >= current.created ? { text, created } : current;
      },
      null,
    );

    return latest?.text ?? null;
  } catch (err) {
    logger.error("[Messages] Error loading latest assistant response:", err);
    return null;
  }
}

async function sendLatestAssistantResponse(
  api: Context["api"],
  chatId: number,
  threadId: number | null,
  sessionId: string,
  directory: string,
): Promise<void> {
  const responseText = await loadLatestAssistantResponse(sessionId, directory);
  if (!responseText) {
    return;
  }

  const parts = renderAssistantFinalPartsSafe(responseText, TELEGRAM_MESSAGE_LIMIT);
  for (const part of parts) {
    await sendBotRenderedPart({
      api,
      chatId,
      part,
      options: getThreadSendOptions(threadId),
    });
  }
}

function parseSelectIndex(data: string): number | null {
  if (!data.startsWith(MESSAGES_CALLBACK_SELECT_PREFIX)) {
    return null;
  }

  const index = Number(data.slice(MESSAGES_CALLBACK_SELECT_PREFIX.length));
  return Number.isInteger(index) && index >= 0 ? index : null;
}

function isForumGroupContext(ctx: Context): boolean {
  return (
    ctx.chat?.type === CHAT_TYPE.SUPERGROUP &&
    Reflect.get(ctx.chat, TELEGRAM_CHAT_FIELD.IS_FORUM) === true
  );
}

async function prepareForkedTopic(
  ctx: Context,
  metadata: MessagesDetailMetadata,
  sessionInfo: SessionInfo,
  sourceScopeKey: string,
  deps: MessagesCallbackDeps,
): Promise<void> {
  if (!ctx.chat) {
    throw new Error("Missing chat for topic fork");
  }

  const currentProject = getCurrentProject(sourceScopeKey);
  const topicTitle = formatTopicTitle(sessionInfo.title, sessionInfo.title);
  const createdTopic = await ctx.api.createForumTopic(ctx.chat.id, topicTitle, {
    icon_color: TOPIC_COLORS.BLUE,
  });
  const topicThreadId = createdTopic.message_thread_id;
  const topicScopeKey = createScopeKeyFromParams({
    chatId: ctx.chat.id,
    threadId: topicThreadId,
    context: SCOPE_CONTEXT.GROUP_TOPIC,
  });

  setCurrentProject(
    {
      id: metadata.projectId,
      worktree: metadata.projectDirectory,
      ...(currentProject?.name ? { name: currentProject.name } : {}),
    },
    topicScopeKey,
  );
  setCurrentSession(sessionInfo, topicScopeKey);
  setCurrentAgent(await resolveProjectAgent(getStoredAgent(sourceScopeKey), sourceScopeKey), topicScopeKey);
  setCurrentModel(getStoredModel(sourceScopeKey), topicScopeKey);

  registerTopicSessionBinding({
    scopeKey: topicScopeKey,
    chatId: ctx.chat.id,
    threadId: topicThreadId,
    sessionId: sessionInfo.id,
    projectId: metadata.projectId,
    projectWorktree: metadata.projectDirectory,
    topicName: topicTitle,
  });

  await deps.ensureEventSubscription(metadata.projectDirectory);
  summaryAggregator.setSession(sessionInfo.id);
  await ingestSessionInfoForCache(sessionInfo);
  clearAllInteractionState("messages_fork_topic_created", sourceScopeKey);
  clearAllInteractionState("messages_fork_topic_created", topicScopeKey);

  if (!pinnedMessageManager.isInitialized(topicScopeKey)) {
    pinnedMessageManager.initialize(ctx.api, ctx.chat.id, topicScopeKey, topicThreadId);
  }
  keyboardManager.initialize(ctx.api, ctx.chat.id, topicScopeKey);

  await pinnedMessageManager.onSessionChange(sessionInfo.id, sessionInfo.title, topicScopeKey);
  if (pinnedMessageManager.getContextLimit(topicScopeKey) === 0) {
    await pinnedMessageManager.refreshContextLimit(topicScopeKey);
  }

  const currentAgent = await resolveProjectAgent(getStoredAgent(topicScopeKey), topicScopeKey);
  const currentModel = getStoredModel(topicScopeKey);
  const contextInfo =
    pinnedMessageManager.getContextInfo(topicScopeKey) ??
    keyboardManager.getContextInfo(topicScopeKey) ??
    (pinnedMessageManager.getContextLimit(topicScopeKey) > 0
      ? { tokensUsed: 0, tokensLimit: pinnedMessageManager.getContextLimit(topicScopeKey) }
      : null);
  const keyboard = createMainKeyboard(
    currentAgent,
    currentModel,
    contextInfo ?? undefined,
    formatVariantForButton(currentModel.variant || "default"),
  );

  const topicReadyMessage = await ctx.api.sendMessage(ctx.chat.id, t("new.topic_created", { title: sessionInfo.title }), {
    ...getThreadSendOptions(topicThreadId),
    reply_markup: keyboard,
  });

  const topicLink = buildTopicMessageLink(ctx.chat, topicReadyMessage.message_id);
  if (topicLink) {
    await ctx.reply(t("new.general_open_link", { url: topicLink }), getThreadSendOptions(getScopeFromContext(ctx)?.threadId ?? null));
  }

  safeBackgroundTask({
    taskName: "messages.sendForkedTopicLatestAssistantResponse",
    task: () =>
      sendLatestAssistantResponse(ctx.api, ctx.chat!.id, topicThreadId, sessionInfo.id, metadata.projectDirectory),
  });
}

async function activateForkedSessionInScope(
  ctx: Context,
  scopeKey: string,
  sessionInfo: SessionInfo,
  deps: MessagesCallbackDeps,
): Promise<void> {
  setCurrentSession(sessionInfo, scopeKey);
  await deps.ensureEventSubscription(sessionInfo.directory);
  summaryAggregator.setSession(sessionInfo.id);
  await ingestSessionInfoForCache(sessionInfo);

  if (!ctx.chat) {
    return;
  }

  const scope = getScopeFromContext(ctx);
  if (ctx.chat.type !== CHAT_TYPE.PRIVATE && !pinnedMessageManager.isInitialized(scopeKey)) {
    pinnedMessageManager.initialize(ctx.api, ctx.chat.id, scopeKey, scope?.threadId ?? null);
  }

  keyboardManager.initialize(ctx.api, ctx.chat.id, scopeKey);

  if (ctx.chat.type !== CHAT_TYPE.PRIVATE && pinnedMessageManager.getContextLimit(scopeKey) === 0) {
    await pinnedMessageManager.refreshContextLimit(scopeKey);
  }

  if (ctx.chat.type !== CHAT_TYPE.PRIVATE) {
    await pinnedMessageManager.onSessionChange(sessionInfo.id, sessionInfo.title, scopeKey);
    await pinnedMessageManager.loadContextFromHistory(sessionInfo.id, sessionInfo.directory, scopeKey);
  }

  const contextInfo =
    (ctx.chat.type !== CHAT_TYPE.PRIVATE ? pinnedMessageManager.getContextInfo(scopeKey) : null) ??
    keyboardManager.getContextInfo(scopeKey);
  if (contextInfo) {
    keyboardManager.updateContext(contextInfo.tokensUsed, contextInfo.tokensLimit, scopeKey);
  }
}

export async function messagesCommand(ctx: CommandContext<Context>): Promise<void> {
  try {
    const scope = getScopeFromContext(ctx);
    const scopeKey = getScopeKeyFromContext(ctx);
    const currentProject = getCurrentProject(scopeKey);
    if (!currentProject) {
      await ctx.reply(t("messages.project_not_selected"), getThreadSendOptions(scope?.threadId ?? null));
      return;
    }

    const currentSession = getCurrentSession(scopeKey);
    if (!currentSession) {
      await ctx.reply(t("messages.session_not_selected"), getThreadSendOptions(scope?.threadId ?? null));
      return;
    }

    if (currentSession.directory !== currentProject.worktree) {
      await ctx.reply(t("messages.session_project_mismatch"), getThreadSendOptions(scope?.threadId ?? null));
      return;
    }

    const messages = await loadUserMessages(currentSession.id, currentSession.directory);
    if (messages.length === 0) {
      await ctx.reply(t("messages.empty"), getThreadSendOptions(scope?.threadId ?? null));
      return;
    }

    const keyboard = buildMessagesListKeyboard(messages, 0, config.bot.messagesListLimit);
    const message = await ctx.reply(formatMessagesSelectText(0), {
      reply_markup: keyboard,
      ...getThreadSendOptions(scope?.threadId ?? null),
    });

    interactionManager.start(
      {
        kind: "custom",
        expectedInput: "callback",
        metadata: {
          flow: "messages",
          stage: "list",
          messageId: message.message_id,
          projectId: currentProject.id,
          projectDirectory: currentProject.worktree,
          sessionId: currentSession.id,
          messages,
          page: 0,
        },
      },
      scopeKey,
    );
  } catch (error) {
    logger.error("[Messages] Error fetching messages list:", error);
    await ctx.reply(
      t("messages.fetch_error"),
      getThreadSendOptions(getScopeFromContext(ctx)?.threadId ?? null),
    );
  }
}

export async function handleMessagesCallback(
  ctx: Context,
  deps: MessagesCallbackDeps,
): Promise<boolean> {
  const data = ctx.callbackQuery?.data;
  if (!data || !data.startsWith(MESSAGES_CALLBACK_PREFIX)) {
    return false;
  }

  const scopeKey = getScopeKeyFromContext(ctx);
  const metadata = parseMessagesMetadata(scopeKey);
  const callbackMessageId = getCallbackMessageId(ctx);
  if (!metadata || callbackMessageId === null || metadata.messageId !== callbackMessageId) {
    await ctx.answerCallbackQuery({ text: t("messages.inactive_callback"), show_alert: true });
    return true;
  }

  try {
    if (data === MESSAGES_CALLBACK_REVERT) {
      if (metadata.stage !== "detail") {
        await ctx.answerCallbackQuery({ text: t("messages.inactive_callback"), show_alert: true });
        return true;
      }

      const selectedMessage = metadata.messages[metadata.selectedIndex];
      if (!selectedMessage) {
        await ctx.answerCallbackQuery({ text: t("messages.fetch_error"), show_alert: true });
        return true;
      }

      await ctx.answerCallbackQuery();

      try {
        await opencodeClient.session.revert({
          sessionID: metadata.sessionId,
          directory: metadata.projectDirectory,
          messageID: selectedMessage.id,
        });

        await ctx.editMessageText(t("messages.revert_success", { text: selectedMessage.text }), {
          reply_markup: undefined,
        });
        clearMessagesInteraction("messages_revert_success", scopeKey);
      } catch (error) {
        logger.error("[Messages] Error reverting message:", error);
        await ctx.editMessageText(t("messages.revert_error"), { reply_markup: undefined });
        clearMessagesInteraction("messages_revert_error", scopeKey);
      }

      return true;
    }

    if (data === MESSAGES_CALLBACK_FORK) {
      if (metadata.stage !== "detail") {
        await ctx.answerCallbackQuery({ text: t("messages.inactive_callback"), show_alert: true });
        return true;
      }

      const selectedMessage = metadata.messages[metadata.selectedIndex];
      if (!selectedMessage) {
        await ctx.answerCallbackQuery({ text: t("messages.fetch_error"), show_alert: true });
        return true;
      }

      await ctx.answerCallbackQuery();

      try {
        const { data: forkedSession, error: forkError } = await opencodeClient.session.fork({
          sessionID: metadata.sessionId,
          messageID: selectedMessage.id,
          directory: metadata.projectDirectory,
        });

        if (forkError || !forkedSession) {
          throw forkError || new Error("No session data received from fork");
        }

        const sessionInfo: SessionInfo = {
          id: forkedSession.id,
          title: forkedSession.title,
          directory: metadata.projectDirectory,
        };

        logger.info(
          `[Messages] Forked session: id=${sessionInfo.id}, title="${sessionInfo.title}", from message=${selectedMessage.id}`,
        );

        if (isForumGroupContext(ctx)) {
          await prepareForkedTopic(ctx, metadata, sessionInfo, scopeKey, deps);
        } else {
          clearAllInteractionState("messages_fork_success", scopeKey);
          await activateForkedSessionInScope(ctx, scopeKey, sessionInfo, deps);

          if (ctx.chat) {
            const keyboard = keyboardManager.getKeyboard(scopeKey);
            await ctx.reply(t("sessions.selected", { title: sessionInfo.title }), {
              reply_markup: keyboard,
              ...getThreadSendOptions(getScopeFromContext(ctx)?.threadId ?? null),
            });
          }

          safeBackgroundTask({
            taskName: "messages.sendLatestAssistantResponse",
            task: () =>
              ctx.chat
                ? sendLatestAssistantResponse(
                    ctx.api,
                    ctx.chat.id,
                    getScopeFromContext(ctx)?.threadId ?? null,
                    sessionInfo.id,
                    sessionInfo.directory,
                  )
                : Promise.resolve(),
          });
        }

        await ctx.editMessageText(t("messages.fork_success", { text: selectedMessage.text }), {
          reply_markup: undefined,
        });
      } catch (error) {
        logger.error("[Messages] Error forking session:", error);
        await ctx.editMessageText(t("messages.fork_error"), { reply_markup: undefined });
        clearMessagesInteraction("messages_fork_error", scopeKey);
      }

      return true;
    }

    if (data === MESSAGES_CALLBACK_BACK) {
      if (metadata.stage !== "detail") {
        await ctx.answerCallbackQuery({ text: t("messages.inactive_callback"), show_alert: true });
        return true;
      }

      const { page: normalizedPage } = calculateMessagesPaginationRange(
        metadata.messages.length,
        metadata.page,
        config.bot.messagesListLimit,
      );

      await ctx.editMessageText(formatMessagesSelectText(normalizedPage), {
        reply_markup: buildMessagesListKeyboard(
          metadata.messages,
          normalizedPage,
          config.bot.messagesListLimit,
        ),
      });
      await ctx.answerCallbackQuery();

      interactionManager.transition(
        {
          expectedInput: "callback",
          metadata: {
            ...metadata,
            stage: "list",
            page: normalizedPage,
          },
        },
        scopeKey,
      );

      return true;
    }

    if (data === MESSAGES_CALLBACK_CANCEL) {
      clearMessagesInteraction("messages_cancelled", scopeKey);
      await ctx.answerCallbackQuery({ text: t("messages.cancelled_callback") });
      await ctx.deleteMessage().catch(() => {});
      return true;
    }

    const page = parseMessagePageCallback(data);
    if (page !== null) {
      if (metadata.stage !== "list") {
        await ctx.answerCallbackQuery({ text: t("callback.processing_error"), show_alert: true });
        return true;
      }

      const { page: normalizedPage, totalPages } = calculateMessagesPaginationRange(
        metadata.messages.length,
        page,
        config.bot.messagesListLimit,
      );

      if (page >= totalPages || page < 0) {
        await ctx.answerCallbackQuery({ text: t("messages.page_empty_callback") });
        return true;
      }

      await ctx.editMessageText(formatMessagesSelectText(normalizedPage), {
        reply_markup: buildMessagesListKeyboard(
          metadata.messages,
          normalizedPage,
          config.bot.messagesListLimit,
        ),
      });
      await ctx.answerCallbackQuery();

      interactionManager.transition(
        {
          expectedInput: "callback",
          metadata: {
            ...metadata,
            page: normalizedPage,
          },
        },
        scopeKey,
      );

      return true;
    }

    const messageIndex = parseSelectIndex(data);
    if (messageIndex === null || metadata.stage !== "list") {
      await ctx.answerCallbackQuery({ text: t("callback.processing_error"), show_alert: true });
      return true;
    }

    const selectedMessage = metadata.messages[messageIndex];
    if (!selectedMessage) {
      await ctx.answerCallbackQuery({ text: t("messages.inactive_callback"), show_alert: true });
      return true;
    }

    await ctx.editMessageText(formatMessageDetailText(selectedMessage), {
      reply_markup: buildMessageDetailKeyboard(),
    });
    await ctx.answerCallbackQuery();

    interactionManager.transition(
      {
        expectedInput: "callback",
        metadata: {
          ...metadata,
          stage: "detail",
          selectedIndex: messageIndex,
        },
      },
      scopeKey,
    );

    return true;
  } catch (error) {
    logger.error("[Messages] Error handling messages callback:", error);
    clearMessagesInteraction("messages_callback_error", scopeKey);
    await ctx.answerCallbackQuery({ text: t("callback.processing_error") }).catch(() => {});
    return true;
  }
}
