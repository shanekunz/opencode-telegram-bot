import { Bot, Context, InputFile, NextFunction } from "grammy";
import { config } from "../config.js";
import { authMiddleware } from "./middleware/auth.js";
import { interactionGuardMiddleware } from "./middleware/interaction-guard.js";
import { scheduledOutputTopicMiddleware } from "./middleware/scheduled-output-topic.js";
import { unknownCommandMiddleware } from "./middleware/unknown-command.js";
import { BOT_COMMANDS, getLocalizedDmBotCommands } from "./commands/definitions.js";
import { startCommand } from "./commands/start.js";
import { helpCommand } from "./commands/help.js";
import { lastCommand } from "./commands/last.js";
import { handleMessagesCallback, messagesCommand } from "./commands/messages.js";
import { statusCommand } from "./commands/status.js";
import {
  AGENT_MODE_BUTTON_TEXT_PATTERN,
  MODEL_BUTTON_TEXT_PATTERN,
  VARIANT_BUTTON_TEXT_PATTERN,
} from "./message-patterns.js";
import { sessionsCommand, handleSessionSelect } from "./commands/sessions.js";
import { createNewCommand } from "./commands/new.js";
import { projectsCommand, handleProjectSelect } from "./commands/projects.js";
import { openCommand, handleOpenCallback } from "./commands/open.js";
import { taskCommand, handleTaskTextAnswer } from "./commands/task.js";
import { handleTaskListCallback, taskListCommand } from "./commands/tasklist.js";
import { abortCommand } from "./commands/abort.js";
import { opencodeStartCommand } from "./commands/opencode-start.js";
import { opencodeStopCommand } from "./commands/opencode-stop.js";
import { renameCommand, handleRenameCancel, handleRenameTextAnswer } from "./commands/rename.js";
import {
  commandsCommand,
  handleCommandsCallback,
  handleCommandTextArguments,
} from "./commands/commands.js";
import {
  handleSkillTextArguments,
  handleSkillsCallback,
  skillsCommand,
} from "./commands/skills.js";
import { ttsCommand } from "./commands/tts.js";
import {
  handleQuestionCallback,
  showCurrentQuestion,
  handleQuestionTextAnswer,
} from "./handlers/question.js";
import { handlePermissionCallback, showPermissionRequest } from "./handlers/permission.js";
import { handleAgentSelect, showAgentSelectionMenu } from "./handlers/agent.js";
import {
  handleModelSearchCallback,
  handleModelSearchResults,
  handleModelSearchTextInput,
  handleModelSelect,
  showModelSelectionMenu,
} from "./handlers/model.js";
import { handleVariantSelect, showVariantSelectionMenu } from "./handlers/variant.js";
import { handleContextButtonPress, handleCompactConfirm } from "./handlers/context.js";
import { handleInlineMenuCancel } from "./handlers/inline-menu.js";
import { questionManager } from "../question/manager.js";
import { interactionManager } from "../interaction/manager.js";
import { clearAllInteractionState } from "../interaction/cleanup.js";
import { keyboardManager } from "../keyboard/manager.js";
import { subscribeToEvents } from "../opencode/events.js";
import { summaryAggregator } from "../summary/aggregator.js";
import {
  formatSummaryWithRawFallback,
  formatToolInfo,
  getAssistantParseMode,
} from "../summary/formatter.js";
import { renderSubagentCards } from "../summary/subagent-formatter.js";
import { ingestSessionInfoForCache } from "../session/cache-manager.js";
import { logger } from "../utils/logger.js";
import { safeBackgroundTask } from "../utils/safe-background-task.js";
import { pinnedMessageManager } from "../pinned/manager.js";
import { taskCreationManager } from "../scheduled-task/creation-manager.js";
import { t } from "../i18n/index.js";
import {
  clearPromptResponseMode,
  dispatchNextQueuedPrompt,
  processUserPrompt,
} from "./handlers/prompt.js";
import { handleVoiceMessage } from "./handlers/voice.js";
import { handleDocumentMessage } from "./handlers/document.js";
import { downloadTelegramFile, toDataUri } from "./utils/file-download.js";
import { editBotRenderedPart, editBotText } from "./utils/telegram-text.js";
import { sendBotRenderedPart, sendBotText } from "./utils/telegram-text.js";
import {
  getTelegramRetryAfterMs,
  isTelegramMessageNotModifiedError,
} from "./utils/send-with-markdown-fallback.js";
import { extractCommandName } from "./utils/commands.js";
import {
  isOperationAbortedSessionError,
  SessionErrorThrottle,
} from "./utils/session-error-filter.js";
import { getModelCapabilities, supportsInput } from "../model/capabilities.js";
import { getStoredModel } from "../model/manager.js";
import { getCurrentProject } from "../settings/manager.js";
import {
  GLOBAL_SCOPE_KEY,
  SCOPE_CONTEXT,
  getChatActionThreadOptions,
  getScopeFromContext,
  getThreadSendOptions,
} from "./scope.js";
import { TelegramRateLimiter } from "./telegram-rate-limiter.js";
import type { Event as OpenCodeEvent, FilePartInput } from "@opencode-ai/sdk/v2";
import { getSessionRouteTarget, listAllTopicBindings } from "../topic/manager.js";
import { BOT_COMMAND, DM_ALLOWED_COMMANDS } from "./commands/constants.js";
import { INTERACTION_CLEAR_REASON } from "../interaction/constants.js";
import { BOT_I18N_KEY, CHAT_TYPE, GENERAL_TOPIC, TELEGRAM_CHAT_FIELD } from "./constants.js";
import { TELEGRAM_CHAT_ACTION } from "./telegram-constants.js";
import { syncTopicTitleForSession } from "../topic/title-sync.js";
import { sendTtsResponseForSession } from "./utils/send-tts-response.js";
import { consumePendingCompactionNotice } from "./utils/pending-compaction-notices.js";
import { LiveStream } from "./streaming/live-stream.js";
import { contextStateManager } from "../context/manager.js";
import { formatContextForButton } from "./utils/keyboard.js";
import { SessionOutputCoordinator } from "./session-output-coordinator.js";
import { assistantRunState } from "./assistant-run-state.js";
import { formatAssistantRunFooter } from "./utils/assistant-run-footer.js";
import { renderAssistantFinalPartsSafe } from "./utils/assistant-rendering.js";
import { createTelegramBotOptions } from "./telegram-client-options.js";

let botInstance: Bot<Context> | null = null;
const initializedCommandChats = new Set<number>();
const renamedGeneralTopicChats = new Set<number>();
const DM_ALLOWED_COMMAND_SET = new Set<string>(DM_ALLOWED_COMMANDS);
const telegramRateLimiter = new TelegramRateLimiter();
const eventCallbackByDirectory = new Map<string, (event: OpenCodeEvent) => void>();

async function ensureGeneralTopicName(ctx: Context): Promise<void> {
  if (!ctx.chat || ctx.chat.type === CHAT_TYPE.PRIVATE) {
    return;
  }

  if (renamedGeneralTopicChats.has(ctx.chat.id)) {
    return;
  }

  const isForumEnabled = Reflect.get(ctx.chat, TELEGRAM_CHAT_FIELD.IS_FORUM) === true;
  if (!isForumEnabled) {
    return;
  }

  try {
    await ctx.api.editGeneralForumTopic(ctx.chat.id, GENERAL_TOPIC.NAME);
    renamedGeneralTopicChats.add(ctx.chat.id);
    logger.info(`[Bot] Renamed General topic in chat ${ctx.chat.id} to "${GENERAL_TOPIC.NAME}"`);
  } catch (error) {
    logger.debug("[Bot] Failed to rename General topic", {
      chatId: ctx.chat.id,
      error,
    });
  }
}

function rememberScopeTarget(ctx: Context): void {
  const scope = getScopeFromContext(ctx);
  if (!scope) {
    return;
  }

  telegramRateLimiter.setActiveScopeKey(scope.key);
}

function isReplyKeyboardControlText(text: string): boolean {
  return (
    AGENT_MODE_BUTTON_TEXT_PATTERN.test(text) ||
    MODEL_BUTTON_TEXT_PATTERN.test(text) ||
    VARIANT_BUTTON_TEXT_PATTERN.test(text) ||
    /^📊(?:\s|$)/.test(text) ||
    text === t("keyboard.general_defaults")
  );
}

function bindBotInstance(bot: Bot<Context>): void {
  botInstance = bot;
}

function getTargetBySessionId(
  sessionId: string,
): { chatId: number; threadId: number | null; scopeKey: string } | null {
  const target = getSessionRouteTarget(sessionId);
  if (!target) {
    return null;
  }

  return {
    chatId: target.chatId,
    threadId: target.threadId,
    scopeKey: target.scopeKey,
  };
}

function extractSessionTitleUpdate(
  event: OpenCodeEvent,
): { sessionId: string; title: string } | null {
  if (event.type !== "session.updated") {
    return null;
  }

  const eventProperties = event.properties as {
    info?: { id?: unknown; title?: unknown };
    session?: { id?: unknown; title?: unknown };
    sessionID?: unknown;
    title?: unknown;
  };

  const infoSessionId =
    typeof eventProperties.info?.id === "string" ? eventProperties.info.id : null;
  const infoTitle =
    typeof eventProperties.info?.title === "string" ? eventProperties.info.title : null;
  if (infoSessionId && infoTitle) {
    return { sessionId: infoSessionId, title: infoTitle };
  }

  const sessionId =
    typeof eventProperties.session?.id === "string"
      ? eventProperties.session.id
      : typeof eventProperties.sessionID === "string"
        ? eventProperties.sessionID
        : null;

  const title =
    typeof eventProperties.session?.title === "string"
      ? eventProperties.session.title
      : typeof eventProperties.title === "string"
        ? eventProperties.title
        : null;

  if (!sessionId || !title) {
    return null;
  }

  return { sessionId, title };
}

const TELEGRAM_DOCUMENT_CAPTION_MAX_LENGTH = 1024;
const SUBAGENT_STREAM_PREFIX = "🧩";
const TODO_STREAM_PREFIX = "__todo__";
const TOOL_STREAM_PREFIX = "__tool__";
const SESSION_ERROR_MESSAGE_MAX_LENGTH = 3500;
const FINAL_DELIVERY_SETTLE_MS = Math.max(1500, config.bot.responseStreamThrottleMs + 500);
const FILE_MUTATION_TOOLS = new Set(["write", "edit", "apply_patch"]);
const sessionErrorThrottle = new SessionErrorThrottle(3000);

function getToolStreamKey(callId: string): string {
  return `${TOOL_STREAM_PREFIX}:${callId}`;
}

async function finalizeSessionDelivery(
  sessionId: string,
  pendingCompletionText: string | null,
): Promise<boolean> {
  let deliveryComplete = false;

  try {
    await liveStream.flushSession(sessionId);
    if (pendingCompletionText) {
      deliveryComplete = await deliverAssistantCompletion(sessionId, pendingCompletionText)
        .then(() => true)
        .catch((error) => {
          logger.error("[Bot] Failed to deliver pending assistant completion", {
            sessionId,
            error,
          });
          return false;
        });
    } else {
      deliveryComplete = true;
    }

    if (!deliveryComplete) {
      return false;
    }

    await liveStream.cleanupAfterFinalDelivery(sessionId);

    const target = getTargetBySessionId(sessionId);
    if (target && pinnedMessageManager.isInitialized(target.scopeKey)) {
      syncKeyboardContextFromPinnedState(target.scopeKey);
      await pinnedMessageManager.flush(target.scopeKey);
    }
  } finally {
    if (deliveryComplete) {
      // Coordinator decides when this finalize attempt is the committed final delivery.
    }
  }

  return deliveryComplete;
}

const sessionOutputCoordinator = new SessionOutputCoordinator({
  settleMs: FINAL_DELIVERY_SETTLE_MS,
  onFinalizeSession: finalizeSessionDelivery,
  onFinalDeliveryCommitted: async (sessionId) => {
    summaryAggregator.stopTypingIndicator(sessionId);
    await liveStream.sealCurrentMessage(sessionId, true);
    await dispatchNextQueuedPrompt(sessionId);
  },
  handlers: {
    onAssistantUpdate: async ({ sessionId, messageId, text }) => {
      await liveStream.updateAssistant(sessionId, messageId, text);
    },
    onAssistantComplete: async ({ sessionId, messageId, text }) => {
      await liveStream.completeAssistant(sessionId, messageId, text);
    },
    onTool: async ({ sessionId, toolInfo }) => {
      if (!botInstance) {
        logger.error("Bot or chat ID not available for sending tool notification");
        return;
      }

      const isFileMutationTool = FILE_MUTATION_TOOLS.has(toolInfo.tool);
      if (config.bot.hideToolCallMessages || isFileMutationTool || toolInfo.tool === "task") {
        return;
      }

      try {
        const target = getTargetBySessionId(sessionId);
        const projectWorktree = target ? getCurrentProject(target.scopeKey)?.worktree : undefined;
        const message = formatToolInfo(toolInfo, projectWorktree);
        if (!message) {
          return;
        }

        const status = "status" in toolInfo.state ? toolInfo.state.status : undefined;
        const streamKey =
          toolInfo.tool === "todowrite" ? TODO_STREAM_PREFIX : getToolStreamKey(toolInfo.callId);

        await liveStream.breakServiceBoundary(sessionId);

        if (status === "running") {
          liveStream.replaceServiceByPrefix(sessionId, streamKey, `⏳ ${message}`);
          return;
        }

        if (status === "error") {
          liveStream.replaceServiceByPrefix(sessionId, streamKey, `❌ ${message}`);
          return;
        }

        liveStream.replaceServiceByPrefix(sessionId, streamKey, `✅ ${message}`);
      } catch (err) {
        logger.error("Failed to send tool notification to Telegram:", err);
      }
    },
    onSubagent: async ({ sessionId, subagents }) => {
      if (config.bot.hideToolCallMessages) {
        return;
      }

      try {
        await liveStream.breakServiceBoundary(sessionId);
        const renderedCards = renderSubagentCards(subagents);
        liveStream.replaceServiceByPrefix(sessionId, SUBAGENT_STREAM_PREFIX, renderedCards);
      } catch (err) {
        logger.error("Failed to render subagent activity for Telegram:", err);
      }
    },
    onToolFile: async ({ sessionId, fileInfo }) => {
      if (!botInstance) {
        logger.error("Bot or chat ID not available for sending file");
        return;
      }

      if (config.bot.hideToolFileMessages) {
        return;
      }

      try {
        const target = getTargetBySessionId(sessionId);
        const projectWorktree = target ? getCurrentProject(target.scopeKey)?.worktree : undefined;
        const toolMessage = formatToolInfo(fileInfo, projectWorktree);
        const caption = prepareDocumentCaption(toolMessage || fileInfo.fileData.caption);

        await liveStream.sealCurrentMessage(sessionId, false, true);
        await sendSessionDocumentMessage(sessionId, {
          ...fileInfo.fileData,
          caption,
        });
      } catch (err) {
        logger.error("Failed to send file to Telegram:", err);
      }
    },
    onQuestion: async ({ sessionId, questions, requestId }) => {
      if (!botInstance) {
        logger.error("Bot or chat ID not available for showing questions");
        return;
      }

      await liveStream.sealCurrentMessage(sessionId, true);

      const target = getTargetBySessionId(sessionId);
      if (!target) {
        return;
      }

      if (questionManager.isActive(target.scopeKey)) {
        logger.warn("[Bot] Replacing active poll with a new one");

        const previousMessageIds = questionManager.getMessageIds(target.scopeKey);
        for (const messageId of previousMessageIds) {
          await botInstance.api.deleteMessage(target.chatId, messageId).catch(() => {});
        }

        clearAllInteractionState(
          INTERACTION_CLEAR_REASON.QUESTION_REPLACED_BY_NEW_POLL,
          target.scopeKey,
        );
      }

      logger.info(
        `[Bot] Received ${questions.length} questions from agent, requestID=${requestId}`,
      );
      questionManager.startQuestions(questions, requestId, target.scopeKey);
      await showCurrentQuestion(botInstance.api, target.chatId, target.scopeKey, target.threadId);
    },
    onPermission: async ({ sessionId, request }) => {
      if (!botInstance) {
        logger.error("Bot or chat ID not available for showing permission request");
        return;
      }

      const target = getTargetBySessionId(sessionId);
      if (!target) {
        return;
      }

      await liveStream.sealCurrentMessage(sessionId);

      logger.info(
        `[Bot] Received permission request from agent: type=${request.permission}, requestID=${request.id}`,
      );
      await showPermissionRequest(
        botInstance.api,
        target.chatId,
        request,
        target.scopeKey,
        target.threadId,
      );
    },
    onThinking: async ({ sessionId }) => {
      if (config.bot.hideThinkingMessages || !botInstance) {
        return;
      }

      const target = getTargetBySessionId(sessionId);
      if (!target) {
        return;
      }

      logger.debug("[Bot] Agent started thinking");
      liveStream.showThinking(sessionId, t("bot.thinking"));
    },
    onSessionError: async ({ sessionId, message }) => {
      if (!botInstance) {
        clearPromptResponseMode(sessionId);
        assistantRunState.clearRun(sessionId, "session_error_no_bot");
        return;
      }

      const target = getTargetBySessionId(sessionId);
      if (!target) {
        clearPromptResponseMode(sessionId);
        assistantRunState.clearRun(sessionId, "session_error_no_target");
        return;
      }

      clearPromptResponseMode(sessionId);
      assistantRunState.clearRun(sessionId, "session_error");
      await liveStream.flushSession(sessionId);
      await liveStream.sealCurrentMessage(sessionId, true);

      const normalizedMessage = message.trim() || t("common.unknown_error");
      if (isOperationAbortedSessionError(normalizedMessage)) {
        logger.info(`[Bot] Suppressing session.abort error notification for ${sessionId}`);
        return;
      }

      if (sessionErrorThrottle.shouldSuppress(sessionId, normalizedMessage)) {
        logger.debug(`[Bot] Suppressing duplicate session.error notification for ${sessionId}`);
        return;
      }

      const truncatedMessage =
        normalizedMessage.length > SESSION_ERROR_MESSAGE_MAX_LENGTH
          ? `${normalizedMessage.slice(0, SESSION_ERROR_MESSAGE_MAX_LENGTH - 3)}...`
          : normalizedMessage;

      await botInstance.api
        .sendMessage(target.chatId, t("bot.session_error", { message: truncatedMessage }), {
          ...getThreadSendOptions(target.threadId),
        })
        .catch((err) => {
          logger.error("[Bot] Failed to send session.error message:", err);
        });
    },
    onSessionRetry: async ({ sessionId, retryInfo }) => {
      if (!botInstance) {
        return;
      }

      const normalizedMessage = retryInfo.message.trim() || t("common.unknown_error");
      const truncatedMessage =
        normalizedMessage.length > SESSION_ERROR_MESSAGE_MAX_LENGTH
          ? `${normalizedMessage.slice(0, SESSION_ERROR_MESSAGE_MAX_LENGTH - 3)}...`
          : normalizedMessage;

      const retryMessage = t("bot.session_retry", { message: truncatedMessage });
      liveStream.pushServiceUpdate(sessionId, retryMessage);
    },
  },
});

function isGroupGeneralControlScope(ctx: Context): boolean {
  const scope = getScopeFromContext(ctx);
  const isForumEnabled =
    ctx.chat?.type === CHAT_TYPE.SUPERGROUP &&
    Reflect.get(ctx.chat, TELEGRAM_CHAT_FIELD.IS_FORUM) === true;

  return Boolean(isForumEnabled && scope?.context === SCOPE_CONTEXT.GROUP_GENERAL && ctx.chat);
}

async function replyGeneralControlPromptRestriction(ctx: Context): Promise<void> {
  await ctx.reply(
    t(BOT_I18N_KEY.GROUP_GENERAL_PROMPTS_DISABLED),
    getThreadSendOptions(getScopeFromContext(ctx)?.threadId ?? null),
  );
}

function prepareDocumentCaption(caption: string): string {
  const normalizedCaption = caption.trim();
  if (!normalizedCaption) {
    return "";
  }

  if (normalizedCaption.length <= TELEGRAM_DOCUMENT_CAPTION_MAX_LENGTH) {
    return normalizedCaption;
  }

  return `${normalizedCaption.slice(0, TELEGRAM_DOCUMENT_CAPTION_MAX_LENGTH - 3)}...`;
}

async function deliverAssistantCompletion(sessionId: string, messageText: string): Promise<void> {
  const normalizedMessageText = messageText.trim();
  if (!normalizedMessageText) {
    return;
  }

  const currentRun = assistantRunState.getRun(sessionId);
  const finalMessageText = currentRun
    ? `${normalizedMessageText}\n\n${formatAssistantRunFooter(currentRun)}`
    : normalizedMessageText;

  if (!botInstance) {
    clearPromptResponseMode(sessionId);
    logger.error("Bot not available for sending message");
    return;
  }

  const target = getTargetBySessionId(sessionId);
  if (!target) {
    clearPromptResponseMode(sessionId);
    return;
  }

  syncKeyboardContextFromPinnedState(target.scopeKey);

  try {
    const activeBot = botInstance;
    if (!activeBot) {
      clearPromptResponseMode(sessionId);
      return;
    }

    const assistantParseMode = getAssistantParseMode();
    const format = assistantParseMode === "MarkdownV2" ? "markdown_v2" : "raw";
    const finalParts = renderAssistantFinalPartsSafe(finalMessageText);
    const formattedParts = formatSummaryWithRawFallback(finalMessageText);

    if (formattedParts.length === 1) {
      const finalizedInPlace = await liveStream.finalizeCurrentMessage(sessionId, {
        format,
        includeKeyboard: keyboardManager.isInitialized(target.scopeKey),
        rawFallbackText: formattedParts[0]?.rawFallbackText,
        renderedPart: finalParts[0],
      });

      if (finalizedInPlace) {
        const ttsSent = await sendTtsResponseForSession({
          api: activeBot.api,
          sessionId,
          chatId: target.chatId,
          threadId: target.threadId,
          text: normalizedMessageText,
        });

        logger.debug("[Bot] Assistant completion finalized in place", {
          sessionId,
          ttsSent,
        });
        assistantRunState.finishRun(sessionId, "final_delivery_in_place");
        return;
      }
    }

    for (let index = 0; index < finalParts.length; index++) {
      const isLastPart = index === finalParts.length - 1;

      while (true) {
        try {
          await sendBotRenderedPart({
            api: activeBot.api,
            chatId: target.chatId,
            part: finalParts[index],
            options: {
              ...(isLastPart && keyboardManager.isInitialized(target.scopeKey)
                ? { reply_markup: keyboardManager.getKeyboard(target.scopeKey) }
                : {}),
              disable_notification: !isLastPart,
              ...getThreadSendOptions(target.threadId),
            },
          });
          break;
        } catch (error) {
          const retryAfterMs = getTelegramRetryAfterMs(error);
          if (!retryAfterMs) {
            throw error;
          }

          logger.info(
            `[Bot] Telegram rate limit; retrying final message send in ${retryAfterMs}ms`,
            {
              sessionId,
            },
          );
          await new Promise((resolve) => setTimeout(resolve, retryAfterMs + 100));
        }
      }
    }

    const ttsSent = await sendTtsResponseForSession({
      api: activeBot.api,
      sessionId,
      chatId: target.chatId,
      threadId: target.threadId,
      text: normalizedMessageText,
    });

    logger.debug("[Bot] Assistant completion finalized", {
      sessionId,
      partCount: finalParts.length,
      ttsSent,
    });
    assistantRunState.finishRun(sessionId, "final_delivery_sent");
  } catch (err) {
    clearPromptResponseMode(sessionId);
    logger.error("Failed to send message to Telegram:", err);
    logger.warn("[Bot] Assistant message delivery failed; keeping event processing active");
    throw err;
  }
}

function syncKeyboardContextFromPinnedState(scopeKey: string): void {
  const contextInfo = contextStateManager.get(scopeKey);
  if (!contextInfo) {
    keyboardManager.clearContext(scopeKey);
    return;
  }

  keyboardManager.updateContext(contextInfo.tokensUsed, contextInfo.tokensLimit, scopeKey);
}

async function sendSessionTextMessage(
  sessionId: string,
  text: string,
  format: "raw" | "markdown_v2" = "raw",
  includeKeyboard: boolean = false,
): Promise<number | null> {
  if (!botInstance) {
    return null;
  }

  const target = getTargetBySessionId(sessionId);
  if (!target) {
    return null;
  }

  const activeBot = botInstance;
  if (!activeBot) {
    return null;
  }

  const message = await sendBotText({
    api: activeBot.api,
    chatId: target.chatId,
    text,
    options: {
      ...(includeKeyboard && keyboardManager.isInitialized(target.scopeKey)
        ? { reply_markup: keyboardManager.getKeyboard(target.scopeKey) }
        : {}),
      disable_notification: true,
      ...getThreadSendOptions(target.threadId),
    },
    format,
  });

  return message.message_id;
}

async function editSessionTextMessage(
  sessionId: string,
  messageId: number,
  text: string,
  format: "raw" | "markdown_v2" = "raw",
  _includeKeyboard: boolean = false,
  rawFallbackText?: string,
): Promise<void> {
  if (!botInstance) {
    return;
  }

  const target = getTargetBySessionId(sessionId);
  if (!target) {
    return;
  }

  const activeBot = botInstance;
  if (!activeBot) {
    return;
  }

  try {
    await editBotText({
      api: activeBot.api,
      chatId: target.chatId,
      messageId,
      text,
      rawFallbackText,
      format,
    });
  } catch (error) {
    if (isTelegramMessageNotModifiedError(error)) {
      logger.debug("[Bot] Suppressing no-op message edit", {
        sessionId,
        messageId,
      });
      return;
    }

    throw error;
  }
}

async function deleteSessionMessage(sessionId: string, messageId: number): Promise<void> {
  if (!botInstance) {
    return;
  }

  const target = getTargetBySessionId(sessionId);
  if (!target) {
    return;
  }

  const activeBot = botInstance;
  if (!activeBot) {
    return;
  }

  await activeBot.api.deleteMessage(target.chatId, messageId);
}

async function sendSessionDocumentMessage(
  sessionId: string,
  fileData: { filename: string; buffer: Buffer; caption: string },
): Promise<void> {
  if (!botInstance) {
    return;
  }

  const target = getTargetBySessionId(sessionId);
  if (!target) {
    return;
  }

  const activeBot = botInstance;
  if (!activeBot) {
    return;
  }

  logger.debug(
    `[Bot] Sending code file: ${fileData.filename} (${fileData.buffer.length} bytes, session=${sessionId})`,
  );

  while (true) {
    try {
      await activeBot.api.sendDocument(
        target.chatId,
        new InputFile(fileData.buffer, fileData.filename),
        {
          caption: fileData.caption,
          disable_notification: true,
          ...getThreadSendOptions(target.threadId),
        },
      );
      return;
    } catch (error) {
      const retryAfterMs = getTelegramRetryAfterMs(error);
      if (!retryAfterMs) {
        throw error;
      }

      logger.info(`[Bot] Telegram rate limit; retrying document send in ${retryAfterMs}ms`, {
        sessionId,
        filename: fileData.filename,
      });
      await new Promise((resolve) => setTimeout(resolve, retryAfterMs + 100));
    }
  }
}

const liveStream = new LiveStream({
  throttleMs: config.bot.responseStreamThrottleMs,
  sendText: async (
    sessionId: string,
    text: string,
    format: "raw" | "markdown_v2" = "raw",
    includeKeyboard: boolean = false,
  ) => await sendSessionTextMessage(sessionId, text, format, includeKeyboard),
  editText: async (
    sessionId: string,
    messageId: number,
    text: string,
    format: "raw" | "markdown_v2" = "raw",
    includeKeyboard: boolean = false,
    rawFallbackText?: string,
  ) =>
    await editSessionTextMessage(
      sessionId,
      messageId,
      text,
      format,
      includeKeyboard,
      rawFallbackText,
    ),
  editRenderedPart: async (sessionId, messageId, part, _includeKeyboard = false) => {
    if (!botInstance) {
      return;
    }

    const target = getTargetBySessionId(sessionId);
    if (!target) {
      return;
    }

    await editBotRenderedPart({
      api: botInstance.api,
      chatId: target.chatId,
      messageId,
      part,
    });
  },
  deleteText: deleteSessionMessage,
});

async function ensureCommandsInitialized(ctx: Context, next: NextFunction): Promise<void> {
  if (!ctx.from || ctx.from.id !== config.telegram.allowedUserId) {
    await next();
    return;
  }

  if (!ctx.chat) {
    logger.warn("[Bot] Cannot initialize commands: chat context is missing");
    await next();
    return;
  }

  if (initializedCommandChats.has(ctx.chat.id)) {
    await next();
    return;
  }

  try {
    if (ctx.chat.type === CHAT_TYPE.PRIVATE) {
      await ctx.api.setMyCommands(getLocalizedDmBotCommands(), {
        scope: {
          type: "chat",
          chat_id: ctx.chat.id,
        },
      });
    } else {
      await ctx.api.setMyCommands(BOT_COMMANDS, {
        scope: {
          type: "chat_member",
          chat_id: ctx.chat.id,
          user_id: ctx.from.id,
        },
      });
    }

    initializedCommandChats.add(ctx.chat.id);
    logger.info(
      `[Bot] Commands initialized for authorized user in chat (chat_id=${ctx.chat.id}, user_id=${ctx.from.id})`,
    );
  } catch (err) {
    logger.error("[Bot] Failed to set commands:", err);
  }

  await next();
}

async function ensureEventSubscription(directory: string): Promise<void> {
  if (!directory) {
    logger.error("No directory found for event subscription");
    return;
  }

  summaryAggregator.setOnCleared(() => {
    sessionOutputCoordinator.clearAll();
    void liveStream.clearAll("summary_aggregator_clear");
  });

  summaryAggregator.setOnMessageUpdated((sessionId, messageId, messageText) => {
    sessionOutputCoordinator.dispatch({
      kind: "assistant_update",
      sessionId,
      messageId,
      text: messageText,
    });
  });

  summaryAggregator.setOnComplete((sessionId, messageId, messageText) => {
    sessionOutputCoordinator.dispatch({
      kind: "assistant_complete",
      sessionId,
      messageId,
      text: messageText,
    });
  });

  summaryAggregator.setOnTool(async (toolInfo) => {
    sessionOutputCoordinator.dispatch({
      kind: "tool",
      sessionId: toolInfo.sessionId,
      toolInfo,
      visibleToUser:
        !config.bot.hideToolCallMessages &&
        !FILE_MUTATION_TOOLS.has(toolInfo.tool) &&
        toolInfo.tool !== "task",
    });
  });

  summaryAggregator.setOnSubagent((sessionId, subagents) => {
    sessionOutputCoordinator.dispatch({
      kind: "subagent",
      sessionId,
      subagents,
      visibleToUser: !config.bot.hideToolCallMessages,
    });
  });

  summaryAggregator.setOnToolFile(async (fileInfo) => {
    sessionOutputCoordinator.dispatch({
      kind: "tool_file",
      sessionId: fileInfo.sessionId,
      fileInfo,
    });
  });

  summaryAggregator.setOnQuestion((sessionId, questions, requestID) => {
    sessionOutputCoordinator.dispatch({
      kind: "question",
      sessionId,
      questions,
      requestId: requestID,
    });
  });

  summaryAggregator.setOnQuestionError(async () => {
    logger.info(`[Bot] Question tool failed, clearing active poll and deleting messages`);

    const bindings = listAllTopicBindings();
    for (const binding of bindings) {
      const messageIds = questionManager.getMessageIds(binding.scopeKey);
      for (const messageId of messageIds) {
        await botInstance?.api.deleteMessage(binding.chatId, messageId).catch((err) => {
          logger.error(`[Bot] Failed to delete question message ${messageId}:`, err);
        });
      }

      clearAllInteractionState(INTERACTION_CLEAR_REASON.QUESTION_ERROR, binding.scopeKey);
    }

    clearAllInteractionState(INTERACTION_CLEAR_REASON.QUESTION_ERROR, GLOBAL_SCOPE_KEY);
  });

  summaryAggregator.setOnPermission((request) => {
    sessionOutputCoordinator.dispatch({
      kind: "permission",
      sessionId: request.sessionID,
      request,
    });
  });

  summaryAggregator.setOnTypingIndicator((sessionId) => {
    if (!botInstance) {
      return;
    }

    const target = getTargetBySessionId(sessionId);
    if (!target) {
      return;
    }

    void botInstance.api
      .sendChatAction(
        target.chatId,
        TELEGRAM_CHAT_ACTION.TYPING,
        getChatActionThreadOptions(target.threadId),
      )
      .catch((error) => {
        logger.debug("[Bot] Failed to send typing indicator", {
          sessionId,
          chatId: target.chatId,
          threadId: target.threadId,
          error,
        });
      });
  });

  summaryAggregator.setOnThinking(async (sessionId) => {
    sessionOutputCoordinator.dispatch({
      kind: "thinking",
      sessionId,
      visibleToUser: !config.bot.hideThinkingMessages,
    });
  });

  summaryAggregator.setOnTokens(async (sessionId, tokens) => {
    const target = getTargetBySessionId(sessionId);
    if (!target) {
      return;
    }

    try {
      logger.debug(`[Bot] Received tokens: input=${tokens.input}, output=${tokens.output}`);

      // Update keyboardManager SYNCHRONOUSLY before any await
      // This ensures keyboard has correct context when onComplete sends the reply
      const contextSize = tokens.input + tokens.cacheRead;
      let contextLimit = pinnedMessageManager.getContextLimit(target.scopeKey);
      if (contextLimit > 0) {
        keyboardManager.updateContext(contextSize, contextLimit, target.scopeKey);
      }

      if (pinnedMessageManager.isInitialized(target.scopeKey)) {
        await pinnedMessageManager.onMessageComplete(tokens, target.scopeKey);

        if (contextLimit <= 0) {
          contextLimit = pinnedMessageManager.getContextLimit(target.scopeKey);
          if (contextLimit > 0) {
            keyboardManager.updateContext(contextSize, contextLimit, target.scopeKey);
          }
        }
      }
    } catch (err) {
      logger.error("[Bot] Error updating pinned message with tokens:", err);
    }
  });

  summaryAggregator.setOnSessionCompacted(async (sessionId, directory) => {
    const target = getTargetBySessionId(sessionId);
    if (!target || !pinnedMessageManager.isInitialized(target.scopeKey)) {
      return;
    }

    try {
      logger.info(`[Bot] Session compacted, reloading context: ${sessionId}`);
      await pinnedMessageManager.onSessionCompacted(sessionId, directory, target.scopeKey);
      syncKeyboardContextFromPinnedState(target.scopeKey);
      await pinnedMessageManager.flush(target.scopeKey);

      if (consumePendingCompactionNotice(sessionId)) {
        const contextInfo = contextStateManager.get(target.scopeKey);
        const keyboard = keyboardManager.isInitialized(target.scopeKey)
          ? keyboardManager.getKeyboard(target.scopeKey)
          : undefined;
        const contextText = contextInfo
          ? t("context.after_compaction", { context: formatContextForButton(contextInfo) })
          : t("context.success");

        await botInstance?.api.sendMessage(target.chatId, contextText, {
          ...(keyboard ? { reply_markup: keyboard } : {}),
          ...getThreadSendOptions(target.threadId),
        });
      }
    } catch (err) {
      logger.error("[Bot] Error reloading context after compaction:", err);
    }
  });

  summaryAggregator.setOnSessionIdle((sessionId) => {
    sessionOutputCoordinator.dispatch({
      kind: "session_idle",
      sessionId,
    });
  });

  summaryAggregator.setOnSessionError(async (sessionId, message) => {
    sessionOutputCoordinator.dispatch({
      kind: "session_error",
      sessionId,
      message,
    });
  });

  summaryAggregator.setOnSessionRetry(async (retryInfo) => {
    sessionOutputCoordinator.dispatch({
      kind: "session_retry",
      sessionId: retryInfo.sessionId,
      retryInfo,
    });
  });

  summaryAggregator.setOnSessionDiff(async (sessionId, diffs) => {
    const target = getTargetBySessionId(sessionId);
    if (!target || !pinnedMessageManager.isInitialized(target.scopeKey)) {
      return;
    }

    try {
      await pinnedMessageManager.onSessionDiff(diffs, target.scopeKey);
    } catch (err) {
      logger.error("[Bot] Error updating session diff:", err);
    }
  });

  summaryAggregator.setOnFileChange((change, sessionId) => {
    const target = getTargetBySessionId(sessionId);
    if (!target || !pinnedMessageManager.isInitialized(target.scopeKey)) {
      return;
    }
    pinnedMessageManager.addFileChange(change, target.scopeKey);
  });

  let eventCallback = eventCallbackByDirectory.get(directory);

  if (!eventCallback) {
    eventCallback = (event: OpenCodeEvent): void => {
      if (event.type === "session.created" || event.type === "session.updated") {
        const info = (
          event.properties as { info?: { directory?: string; time?: { updated?: number } } }
        ).info;

        if (info?.directory) {
          safeBackgroundTask({
            taskName: `session.cache.${event.type}`,
            task: () => ingestSessionInfoForCache(info),
          });
        }
      }

      const sessionTitleUpdate = extractSessionTitleUpdate(event);
      if (sessionTitleUpdate && botInstance) {
        const activeBot = botInstance;
        safeBackgroundTask({
          taskName: "topic.title.sync_from_event",
          task: () =>
            syncTopicTitleForSession(
              activeBot.api,
              sessionTitleUpdate.sessionId,
              sessionTitleUpdate.title,
            ),
          onError: (syncError) => {
            logger.debug("[Bot] Failed to sync topic title from session.updated", {
              sessionId: sessionTitleUpdate.sessionId,
              syncError,
            });
          },
        });
      }

      summaryAggregator.processEvent(event);
    };

    eventCallbackByDirectory.set(directory, eventCallback);
    logger.info(`[Bot] Subscribing to OpenCode events for project: ${directory}`);
  }

  subscribeToEvents(directory, eventCallback).catch((err) => {
    logger.error("Failed to subscribe to events:", err);
  });
}

async function prepareSessionForPrompt(sessionId: string): Promise<void> {
  await sessionOutputCoordinator.flushPendingFinalDelivery(sessionId);
  await liveStream.sealCurrentMessage(sessionId, true);
}

export function createBot(): Bot<Context> {
  clearAllInteractionState(INTERACTION_CLEAR_REASON.BOT_STARTUP);

  const botOptions = createTelegramBotOptions(config.telegram);

  const bot = new Bot(config.telegram.token, botOptions);
  bindBotInstance(bot);

  bot.api.config.use((prev, method, payload, signal) => {
    return telegramRateLimiter.enqueue(method, payload, () => prev(method, payload, signal));
  });

  // Heartbeat for diagnostics: verify the event loop is not blocked
  let heartbeatCounter = 0;
  setInterval(() => {
    heartbeatCounter++;
    if (heartbeatCounter % 6 === 0) {
      // Log every 30 seconds (5 sec * 6)
      logger.debug(`[Bot] Heartbeat #${heartbeatCounter} - event loop alive`);
    }
  }, 5000);

  // Log all API calls for diagnostics
  let lastGetUpdatesTime = Date.now();
  bot.api.config.use(async (prev, method, payload, signal) => {
    if (method === "getUpdates") {
      const now = Date.now();
      const timeSinceLast = now - lastGetUpdatesTime;
      logger.debug(`[Bot API] getUpdates called (${timeSinceLast}ms since last)`);
      lastGetUpdatesTime = now;
    } else if (method === "sendMessage") {
      logger.debug(`[Bot API] sendMessage to chat ${(payload as { chat_id?: number }).chat_id}`);
    }
    return prev(method, payload, signal);
  });

  bot.use((ctx, next) => {
    bindBotInstance(bot);
    rememberScopeTarget(ctx);

    const hasCallbackQuery = !!ctx.callbackQuery;
    const hasMessage = !!ctx.message;
    const callbackData = ctx.callbackQuery?.data || "N/A";
    logger.debug(
      `[DEBUG] Incoming update: hasCallbackQuery=${hasCallbackQuery}, hasMessage=${hasMessage}, callbackData=${callbackData}`,
    );
    return next();
  });

  bot.use(authMiddleware);
  bot.use(async (ctx, next) => {
    if (ctx.message && ctx.chat?.type !== CHAT_TYPE.PRIVATE) {
      await ensureGeneralTopicName(ctx);
    }

    await next();
  });
  bot.use(ensureCommandsInitialized);
  bot.use(interactionGuardMiddleware);
  bot.use(scheduledOutputTopicMiddleware);
  bot.use(async (ctx, next) => {
    if (ctx.chat?.type !== CHAT_TYPE.PRIVATE) {
      await next();
      return;
    }

    const text = ctx.message?.text;
    if (text) {
      const commandName = extractCommandName(text);
      if (commandName) {
        if (DM_ALLOWED_COMMAND_SET.has(commandName)) {
          await next();
          return;
        }

        await ctx.reply(t("dm.restricted.command"));
        return;
      }

      await ctx.reply(t("dm.restricted.prompt"));
      return;
    }

    if (ctx.message?.photo || ctx.message?.document || ctx.message?.voice || ctx.message?.audio) {
      await ctx.reply(t("dm.restricted.prompt"));
      return;
    }

    await next();
  });

  const blockMenuWhileInteractionActive = async (
    ctx: Context,
    menuKind?: "agent" | "model" | "variant" | "context",
  ): Promise<boolean> => {
    const activeInteraction = interactionManager.getSnapshot(
      getScopeFromContext(ctx)?.key ?? GLOBAL_SCOPE_KEY,
    );
    if (!activeInteraction) {
      return false;
    }

    const taskStage = String(activeInteraction.metadata.stage ?? "");
    const allowTaskDraftDefaultChange =
      activeInteraction.kind === "task" &&
      activeInteraction.expectedInput === "mixed" &&
      taskStage === "prompt" &&
      (menuKind === "agent" || menuKind === "model" || menuKind === "variant");

    if (allowTaskDraftDefaultChange) {
      return false;
    }

    logger.debug(
      `[Bot] Blocking menu open while interaction active: kind=${activeInteraction.kind}, expectedInput=${activeInteraction.expectedInput}`,
    );
    await ctx.reply(
      activeInteraction.kind === "task"
        ? t("task.blocked.only_defaults_before_prompt")
        : t("interaction.blocked.finish_current"),
    );
    return true;
  };

  bot.command(BOT_COMMAND.START, startCommand);
  bot.command(BOT_COMMAND.HELP, helpCommand);
  bot.command(BOT_COMMAND.STATUS, statusCommand);
  bot.command(BOT_COMMAND.LAST, lastCommand);
  bot.command(BOT_COMMAND.TTS, ttsCommand);
  bot.command(BOT_COMMAND.OPENCODE_START, opencodeStartCommand);
  bot.command(BOT_COMMAND.OPENCODE_STOP, opencodeStopCommand);
  bot.command(BOT_COMMAND.PROJECTS, projectsCommand);
  bot.command(BOT_COMMAND.OPEN, openCommand);
  bot.command(BOT_COMMAND.TASK, taskCommand);
  bot.command(BOT_COMMAND.TASKLIST, taskListCommand);
  bot.command(BOT_COMMAND.SESSIONS, sessionsCommand);
  bot.command(BOT_COMMAND.MESSAGES, messagesCommand);
  bot.command(BOT_COMMAND.NEW, createNewCommand({ ensureEventSubscription }));
  bot.command(BOT_COMMAND.ABORT, abortCommand);
  bot.command(BOT_COMMAND.RENAME, renameCommand);
  bot.command(BOT_COMMAND.COMMANDS, commandsCommand);
  bot.command(BOT_COMMAND.SKILLS, skillsCommand);

  bot.on("message:text", unknownCommandMiddleware);

  bot.on("callback_query:data", async (ctx) => {
    logger.debug(`[Bot] Received callback_query:data: ${ctx.callbackQuery?.data}`);
    logger.debug(`[Bot] Callback context: from=${ctx.from?.id}, chat=${ctx.chat?.id}`);

    if (ctx.chat) {
      botInstance = bot;
      rememberScopeTarget(ctx);
    }

    try {
      const handledInlineCancel = await handleInlineMenuCancel(ctx);
      const handledSession = await handleSessionSelect(ctx);
      const handledProject = await handleProjectSelect(ctx);
      const handledOpen = await handleOpenCallback(ctx);
      const handledTaskList = await handleTaskListCallback(ctx);
      const handledQuestion = await handleQuestionCallback(ctx);
      const handledPermission = await handlePermissionCallback(ctx);
      const handledAgent = await handleAgentSelect(ctx);
      const handledModelSearch = await handleModelSearchCallback(ctx);
      const handledModelSearchResults = await handleModelSearchResults(ctx);
      const handledModel = await handleModelSelect(ctx);
      const handledVariant = await handleVariantSelect(ctx);
      const handledCompactConfirm = await handleCompactConfirm(ctx);
      const handledRenameCancel = await handleRenameCancel(ctx);
      const handledCommands = await handleCommandsCallback(ctx, { ensureEventSubscription });
      const handledMessages = await handleMessagesCallback(ctx, { ensureEventSubscription });
      const handledSkills = await handleSkillsCallback(ctx, {
        bot,
        ensureEventSubscription,
        prepareSessionForPrompt,
      });

      logger.debug(
        `[Bot] Callback handled: inlineCancel=${handledInlineCancel}, session=${handledSession}, project=${handledProject}, open=${handledOpen}, taskList=${handledTaskList}, question=${handledQuestion}, permission=${handledPermission}, agent=${handledAgent}, modelSearch=${handledModelSearch}, modelSearchResults=${handledModelSearchResults}, model=${handledModel}, variant=${handledVariant}, compactConfirm=${handledCompactConfirm}, rename=${handledRenameCancel}, commands=${handledCommands}, messages=${handledMessages}, skills=${handledSkills}`,
      );

      if (
        !handledInlineCancel &&
        !handledSession &&
        !handledProject &&
        !handledOpen &&
        !handledTaskList &&
        !handledQuestion &&
        !handledPermission &&
        !handledAgent &&
        !handledModelSearch &&
        !handledModelSearchResults &&
        !handledModel &&
        !handledVariant &&
        !handledCompactConfirm &&
        !handledRenameCancel &&
        !handledCommands &&
        !handledMessages &&
        !handledSkills
      ) {
        logger.debug("Unknown callback query:", ctx.callbackQuery?.data);
        await ctx.answerCallbackQuery({ text: t("callback.unknown_command") });
      }
    } catch (err) {
      logger.error("[Bot] Error handling callback:", err);
      clearAllInteractionState(
        INTERACTION_CLEAR_REASON.CALLBACK_HANDLER_ERROR,
        getScopeFromContext(ctx)?.key ?? GLOBAL_SCOPE_KEY,
      );
      await ctx.answerCallbackQuery({ text: t("callback.processing_error") }).catch(() => {});
    }
  });

  // Handle Reply Keyboard button press (agent indicator)
  bot.hears(AGENT_MODE_BUTTON_TEXT_PATTERN, async (ctx) => {
    logger.debug(`[Bot] Agent mode button pressed: ${ctx.message?.text}`);

    try {
      if (await blockMenuWhileInteractionActive(ctx, "agent")) {
        return;
      }

      await showAgentSelectionMenu(ctx);
    } catch (err) {
      logger.error("[Bot] Error showing agent menu:", err);
      await ctx.reply(t("error.load_agents"));
    }
  });

  // Handle Reply Keyboard button press (model selector)
  // Model button text is produced by formatModelForButton() and always starts with "🤖 ".
  bot.hears(MODEL_BUTTON_TEXT_PATTERN, async (ctx) => {
    logger.debug(`[Bot] Model button pressed: ${ctx.message?.text}`);

    try {
      if (await blockMenuWhileInteractionActive(ctx, "model")) {
        return;
      }

      await showModelSelectionMenu(ctx);
    } catch (err) {
      logger.error("[Bot] Error showing model menu:", err);
      await ctx.reply(t("error.load_models"));
    }
  });

  bot.hears(t("keyboard.general_defaults"), async (ctx) => {
    await ctx.reply(
      t("keyboard.general_defaults_info"),
      getThreadSendOptions(getScopeFromContext(ctx)?.threadId ?? null),
    );
  });

  // Handle Reply Keyboard button press (context button)
  bot.hears(/^📊(?:\s|$)/, async (ctx) => {
    logger.debug(`[Bot] Context button pressed: ${ctx.message?.text}`);

    try {
      if (await blockMenuWhileInteractionActive(ctx, "context")) {
        return;
      }

      await handleContextButtonPress(ctx);
    } catch (err) {
      logger.error("[Bot] Error handling context button:", err);
      await ctx.reply(t("error.context_button"));
    }
  });

  // Handle Reply Keyboard button press (variant selector)
  // Keep support for both legacy "💭" and current "💡" prefix.
  bot.hears(VARIANT_BUTTON_TEXT_PATTERN, async (ctx) => {
    logger.debug(`[Bot] Variant button pressed: ${ctx.message?.text}`);

    try {
      if (await blockMenuWhileInteractionActive(ctx, "variant")) {
        return;
      }

      await showVariantSelectionMenu(ctx);
    } catch (err) {
      logger.error("[Bot] Error showing variant menu:", err);
      await ctx.reply(t("error.load_variants"));
    }
  });

  bot.on("message:text", async (ctx, next) => {
    const text = ctx.message?.text;
    if (text) {
      const isCommand = text.startsWith("/");
      logger.debug(
        `[Bot] Received text message: ${isCommand ? `command="${text}"` : `prompt (length=${text.length})`}, chatId=${ctx.chat.id}`,
      );
    }
    await next();
  });

  // Remove any previously set global commands to prevent unauthorized users from seeing them
  safeBackgroundTask({
    taskName: "bot.clearGlobalCommands",
    task: async () => {
      try {
        await Promise.all([
          bot.api.setMyCommands([], { scope: { type: "default" } }),
          bot.api.setMyCommands([], { scope: { type: "all_private_chats" } }),
        ]);
        return { success: true as const };
      } catch (error) {
        return { success: false as const, error };
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        logger.info("[Bot] Cleared global commands (default and all_private_chats scopes)");
        return;
      }

      logger.warn("[Bot] Could not clear global commands:", result.error);
    },
  });

  // Voice and audio message handlers (STT transcription -> prompt)
  const voicePromptDeps = { bot, ensureEventSubscription, prepareSessionForPrompt };

  bot.on("message:voice", async (ctx) => {
    logger.debug(`[Bot] Received voice message, chatId=${ctx.chat.id}`);
    botInstance = bot;
    rememberScopeTarget(ctx);

    const scopeKey = getScopeFromContext(ctx)?.key ?? GLOBAL_SCOPE_KEY;
    if (questionManager.isActive(scopeKey)) {
      await handleVoiceMessage(ctx, {
        ...voicePromptDeps,
        processPrompt: async (voiceCtx, text) => {
          await handleQuestionTextAnswer(voiceCtx, text);
          return true;
        },
      });
      return;
    }

    if (isGroupGeneralControlScope(ctx)) {
      await replyGeneralControlPromptRestriction(ctx);
      return;
    }

    await handleVoiceMessage(ctx, voicePromptDeps);
  });

  bot.on("message:audio", async (ctx) => {
    logger.debug(`[Bot] Received audio message, chatId=${ctx.chat.id}`);
    botInstance = bot;
    rememberScopeTarget(ctx);

    const scopeKey = getScopeFromContext(ctx)?.key ?? GLOBAL_SCOPE_KEY;
    if (questionManager.isActive(scopeKey)) {
      await handleVoiceMessage(ctx, {
        ...voicePromptDeps,
        processPrompt: async (voiceCtx, text) => {
          await handleQuestionTextAnswer(voiceCtx, text);
          return true;
        },
      });
      return;
    }

    if (isGroupGeneralControlScope(ctx)) {
      await replyGeneralControlPromptRestriction(ctx);
      return;
    }

    await handleVoiceMessage(ctx, voicePromptDeps);
  });

  // Photo message handler
  bot.on("message:photo", async (ctx) => {
    logger.debug(`[Bot] Received photo message, chatId=${ctx.chat.id}`);

    if (isGroupGeneralControlScope(ctx)) {
      await replyGeneralControlPromptRestriction(ctx);
      return;
    }

    const photos = ctx.message?.photo;
    if (!photos || photos.length === 0) {
      return;
    }

    const caption = ctx.message.caption || "";

    try {
      // Get the largest photo (last element in array)
      const largestPhoto = photos[photos.length - 1];

      // Check model capabilities
      const scopeKey = getScopeFromContext(ctx)?.key ?? GLOBAL_SCOPE_KEY;
      const storedModel = getStoredModel(scopeKey);
      const capabilities = await getModelCapabilities(storedModel.providerID, storedModel.modelID);

      if (!supportsInput(capabilities, "image")) {
        logger.warn(
          `[Bot] Model ${storedModel.providerID}/${storedModel.modelID} doesn't support image input`,
        );
        await ctx.reply(t("bot.photo_model_no_image"));

        // Fall back to caption-only if present
        if (caption.trim().length > 0) {
          botInstance = bot;
          rememberScopeTarget(ctx);
          const promptDeps = { bot, ensureEventSubscription, prepareSessionForPrompt };
          await processUserPrompt(ctx, caption, promptDeps);
        }
        return;
      }

      // Download photo
      await ctx.reply(t("bot.photo_downloading"));
      const downloadedFile = await downloadTelegramFile(ctx.api, largestPhoto.file_id);

      // Convert to data URI (Telegram always converts photos to JPEG)
      const dataUri = toDataUri(downloadedFile.buffer, "image/jpeg");

      // Create file part
      const filePart: FilePartInput = {
        type: "file",
        mime: "image/jpeg",
        filename: "photo.jpg",
        url: dataUri,
      };

      logger.info(`[Bot] Sending photo (${downloadedFile.buffer.length} bytes) with prompt`);

      botInstance = bot;
      rememberScopeTarget(ctx);

      // Send via processUserPrompt with file part
      const promptDeps = { bot, ensureEventSubscription, prepareSessionForPrompt };
      await processUserPrompt(ctx, caption, promptDeps, [filePart]);
    } catch (err) {
      logger.error("[Bot] Error handling photo message:", err);
      await ctx.reply(t("bot.photo_download_error"));
    }
  });

  // Document message handler (PDF and text files)
  bot.on("message:document", async (ctx) => {
    logger.debug(`[Bot] Received document message, chatId=${ctx.chat.id}`);
    botInstance = bot;
    rememberScopeTarget(ctx);

    if (isGroupGeneralControlScope(ctx)) {
      await replyGeneralControlPromptRestriction(ctx);
      return;
    }

    const deps = { bot, ensureEventSubscription, prepareSessionForPrompt };
    await handleDocumentMessage(ctx, deps);
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message?.text;
    if (!text) {
      return;
    }

    botInstance = bot;
    rememberScopeTarget(ctx);

    if (text.startsWith("/")) {
      return;
    }

    const scopeKey = getScopeFromContext(ctx)?.key ?? GLOBAL_SCOPE_KEY;

    if (questionManager.isActive(scopeKey)) {
      await handleQuestionTextAnswer(ctx);
      return;
    }

    const handledRename = await handleRenameTextAnswer(ctx);
    if (handledRename) {
      return;
    }

    const handledTask = await handleTaskTextAnswer(ctx);
    if (handledTask) {
      return;
    }

    const handledModelSearchText = await handleModelSearchTextInput(ctx);
    if (handledModelSearchText) {
      return;
    }

    if (taskCreationManager.isActive(scopeKey) && isReplyKeyboardControlText(text)) {
      logger.debug("[Bot] Ignoring reply keyboard control text during task setup");
      return;
    }

    const promptDeps = { bot, ensureEventSubscription, prepareSessionForPrompt };
    const handledCommandArgs = await handleCommandTextArguments(ctx, promptDeps);
    if (handledCommandArgs) {
      return;
    }

    const handledSkillArgs = await handleSkillTextArguments(ctx, promptDeps);
    if (handledSkillArgs) {
      return;
    }

    if (isGroupGeneralControlScope(ctx)) {
      await replyGeneralControlPromptRestriction(ctx);
      return;
    }

    await processUserPrompt(ctx, text, promptDeps);

    logger.debug("[Bot] message:text handler completed (prompt sent in background)");
  });

  bot.catch((err) => {
    logger.error("[Bot] Unhandled error in bot:", err);
    clearAllInteractionState(
      "bot_unhandled_error",
      err.ctx ? (getScopeFromContext(err.ctx)?.key ?? GLOBAL_SCOPE_KEY) : GLOBAL_SCOPE_KEY,
    );
    if (err.ctx) {
      logger.error(
        "[Bot] Error context - update type:",
        err.ctx.update ? Object.keys(err.ctx.update) : "unknown",
      );
    }
  });

  return bot;
}

export function cleanupBotRuntime(reason: string): void {
  summaryAggregator.clear();
  sessionOutputCoordinator.clearAll();
  void liveStream.clearAll(reason);
  eventCallbackByDirectory.clear();
  initializedCommandChats.clear();
  renamedGeneralTopicChats.clear();
  botInstance = null;
}
