import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Context } from "grammy";
import {
  calculateMessagesPaginationRange,
  handleMessagesCallback,
  messagesCommand,
  parseMessagePageCallback,
} from "../../../src/bot/commands/messages.js";
import { interactionManager } from "../../../src/interaction/manager.js";
import { t } from "../../../src/i18n/index.js";

const mocked = vi.hoisted(() => ({
  scopeKey: "chat:1",
  scope: { key: "chat:1", chatId: 1, threadId: null, context: "group-general" },
  currentProject: { id: "project-1", worktree: "/repo", name: "repo" } as
    | { id: string; worktree: string; name?: string }
    | null,
  currentSession: { id: "session-1", title: "Session", directory: "/repo" } as
    | { id: string; title: string; directory: string }
    | null,
  sessionMessagesMock: vi.fn(),
  sessionGetMock: vi.fn(),
  sessionRevertMock: vi.fn(),
  sessionForkMock: vi.fn(),
  setCurrentSessionMock: vi.fn(),
  setCurrentProjectMock: vi.fn(),
  setCurrentAgentMock: vi.fn(),
  setCurrentModelMock: vi.fn(),
  resolveProjectAgentMock: vi.fn().mockResolvedValue("build"),
  getStoredAgentMock: vi.fn().mockReturnValue("build"),
  getStoredModelMock: vi.fn().mockReturnValue({
    providerID: "openai",
    modelID: "gpt-5",
    variant: "default",
  }),
  keyboardInitializeMock: vi.fn(),
  keyboardGetKeyboardMock: vi.fn().mockReturnValue({ keyboard: true }),
  keyboardGetContextInfoMock: vi.fn().mockReturnValue(null),
  keyboardUpdateContextMock: vi.fn(),
  pinnedIsInitializedMock: vi.fn().mockReturnValue(false),
  pinnedInitializeMock: vi.fn(),
  pinnedOnSessionChangeMock: vi.fn().mockResolvedValue(undefined),
  pinnedRefreshContextLimitMock: vi.fn().mockResolvedValue(undefined),
  pinnedLoadContextMock: vi.fn().mockResolvedValue(undefined),
  pinnedGetContextLimitMock: vi.fn().mockReturnValue(0),
  pinnedGetContextInfoMock: vi.fn().mockReturnValue(null),
  registerTopicSessionBindingMock: vi.fn(),
  ingestSessionInfoForCacheMock: vi.fn().mockResolvedValue(undefined),
  summarySetSessionMock: vi.fn(),
  createMainKeyboardMock: vi.fn().mockReturnValue({ inline_keyboard: [] }),
  sendBotRenderedPartMock: vi.fn().mockResolvedValue(undefined),
  buildTopicMessageLinkMock: vi.fn().mockReturnValue("https://t.me/c/1/999"),
  safeBackgroundTaskMock: vi.fn(),
}));

vi.mock("../../../src/config.js", () => ({
  config: {
    bot: {
      messagesListLimit: 10,
    },
  },
}));

vi.mock("../../../src/bot/scope.js", () => ({
  SCOPE_CONTEXT: {
    DM: "dm",
    GROUP_GENERAL: "group-general",
    GROUP_TOPIC: "group-topic",
  },
  getScopeFromContext: vi.fn(() => mocked.scope),
  getScopeKeyFromContext: vi.fn(() => mocked.scopeKey),
  getThreadSendOptions: vi.fn((threadId: number | null) =>
    threadId === null ? {} : { message_thread_id: threadId },
  ),
  createScopeKeyFromParams: vi.fn(({ chatId, threadId }: { chatId: number; threadId: number }) =>
    `${chatId}:${threadId}`,
  ),
}));

vi.mock("../../../src/settings/manager.js", () => ({
  getCurrentProject: vi.fn(() => mocked.currentProject),
  setCurrentProject: mocked.setCurrentProjectMock,
  setCurrentAgent: mocked.setCurrentAgentMock,
  setCurrentModel: mocked.setCurrentModelMock,
}));

vi.mock("../../../src/session/manager.js", () => ({
  getCurrentSession: vi.fn(() => mocked.currentSession),
  setCurrentSession: mocked.setCurrentSessionMock,
}));

vi.mock("../../../src/agent/manager.js", () => ({
  getStoredAgent: mocked.getStoredAgentMock,
  resolveProjectAgent: mocked.resolveProjectAgentMock,
}));

vi.mock("../../../src/model/manager.js", () => ({
  getStoredModel: mocked.getStoredModelMock,
}));

vi.mock("../../../src/opencode/client.js", () => ({
  opencodeClient: {
    session: {
      messages: mocked.sessionMessagesMock,
      get: mocked.sessionGetMock,
      revert: mocked.sessionRevertMock,
      fork: mocked.sessionForkMock,
    },
  },
}));

vi.mock("../../../src/keyboard/manager.js", () => ({
  keyboardManager: {
    initialize: mocked.keyboardInitializeMock,
    getKeyboard: mocked.keyboardGetKeyboardMock,
    getContextInfo: mocked.keyboardGetContextInfoMock,
    updateContext: mocked.keyboardUpdateContextMock,
  },
}));

vi.mock("../../../src/pinned/manager.js", () => ({
  pinnedMessageManager: {
    isInitialized: mocked.pinnedIsInitializedMock,
    initialize: mocked.pinnedInitializeMock,
    onSessionChange: mocked.pinnedOnSessionChangeMock,
    refreshContextLimit: mocked.pinnedRefreshContextLimitMock,
    loadContextFromHistory: mocked.pinnedLoadContextMock,
    getContextLimit: mocked.pinnedGetContextLimitMock,
    getContextInfo: mocked.pinnedGetContextInfoMock,
  },
}));

vi.mock("../../../src/topic/manager.js", () => ({
  registerTopicSessionBinding: mocked.registerTopicSessionBindingMock,
}));

vi.mock("../../../src/session/cache-manager.js", () => ({
  ingestSessionInfoForCache: mocked.ingestSessionInfoForCacheMock,
  __resetSessionDirectoryCacheForTests: vi.fn(),
}));

vi.mock("../../../src/utils/safe-background-task.js", () => ({
  safeBackgroundTask: mocked.safeBackgroundTaskMock,
}));

vi.mock("../../../src/utils/logger.js", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("../../../src/summary/aggregator.js", () => ({
  summaryAggregator: {
    setSession: mocked.summarySetSessionMock,
    clear: vi.fn(),
  },
}));

vi.mock("../../../src/bot/utils/assistant-rendering.js", () => ({
  renderAssistantFinalPartsSafe: vi.fn(() => []),
}));

vi.mock("../../../src/bot/utils/telegram-text.js", () => ({
  sendBotRenderedPart: mocked.sendBotRenderedPartMock,
}));

vi.mock("../../../src/bot/utils/topic-link.js", () => ({
  buildTopicMessageLink: mocked.buildTopicMessageLinkMock,
}));

vi.mock("../../../src/bot/utils/keyboard.js", () => ({
  createMainKeyboard: mocked.createMainKeyboardMock,
}));

vi.mock("../../../src/variant/manager.js", () => ({
  formatVariantForButton: vi.fn(() => "Default"),
}));

vi.mock("../../../src/topic/colors.js", () => ({
  TOPIC_COLORS: {
    BLUE: 1,
  },
}));

vi.mock("../../../src/topic/title-format.js", () => ({
  formatTopicTitle: vi.fn((title: string) => title),
}));

function createCommandContext(messageId: number): Context {
  return {
    chat: { id: 1, type: "supergroup", is_forum: true },
    reply: vi.fn().mockResolvedValue({ message_id: messageId }),
  } as unknown as Context;
}

function createCallbackContext(data: string, messageId: number): Context {
  return {
    chat: { id: 1, type: "supergroup", is_forum: true },
    callbackQuery: {
      data,
      message: { message_id: messageId },
    } as Context["callbackQuery"],
    answerCallbackQuery: vi.fn().mockResolvedValue(undefined),
    editMessageText: vi.fn().mockResolvedValue(undefined),
    deleteMessage: vi.fn().mockResolvedValue(undefined),
    reply: vi.fn().mockResolvedValue({ message_id: 901 }),
    api: {
      createForumTopic: vi.fn().mockResolvedValue({ message_thread_id: 77 }),
      sendMessage: vi.fn().mockResolvedValue({ message_id: 999 }),
    },
  } as unknown as Context;
}

function makeUserMessage(id: string, text: string, created: number) {
  return {
    info: {
      id,
      role: "user",
      time: { created },
    },
    parts: [{ type: "text", text }],
  };
}

describe("bot/commands/messages", () => {
  beforeEach(() => {
    interactionManager.clear("test_setup", mocked.scopeKey);
    mocked.scopeKey = "chat:1";
    mocked.scope = { key: "chat:1", chatId: 1, threadId: null, context: "group-general" };
    mocked.currentProject = { id: "project-1", worktree: "/repo", name: "repo" };
    mocked.currentSession = { id: "session-1", title: "Session", directory: "/repo" };
    mocked.sessionMessagesMock.mockReset();
    mocked.sessionGetMock.mockReset();
    mocked.sessionRevertMock.mockReset();
    mocked.sessionForkMock.mockReset();
    mocked.setCurrentSessionMock.mockReset();
    mocked.setCurrentProjectMock.mockReset();
    mocked.setCurrentAgentMock.mockReset();
    mocked.setCurrentModelMock.mockReset();
    mocked.resolveProjectAgentMock.mockClear();
    mocked.keyboardInitializeMock.mockReset();
    mocked.keyboardGetKeyboardMock.mockReturnValue({ keyboard: true });
    mocked.pinnedIsInitializedMock.mockReturnValue(false);
    mocked.safeBackgroundTaskMock.mockReset();

    mocked.sessionGetMock.mockResolvedValue({ data: { revert: null }, error: null });
  });

  it("shows user messages newest first and starts scoped interaction", async () => {
    const oldTime = new Date(2026, 4, 30, 10, 3).getTime();
    const newTime = new Date(2026, 4, 30, 14, 5).getTime();
    mocked.sessionMessagesMock.mockResolvedValue({
      data: [
        makeUserMessage("old", "older prompt", oldTime),
        { info: { id: "assistant-1", role: "assistant", time: { created: newTime + 1 } }, parts: [{ type: "text", text: "assistant" }] },
        makeUserMessage("new", "newer prompt with\nline break", newTime),
      ],
      error: null,
    });

    const ctx = createCommandContext(200);
    await messagesCommand(ctx as never);

    expect(mocked.sessionMessagesMock).toHaveBeenCalledWith({
      sessionID: "session-1",
      directory: "/repo",
    });

    const [, options] = (ctx.reply as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      { reply_markup: { inline_keyboard: Array<Array<{ callback_data?: string; text: string }>> } },
    ];
    expect(options.reply_markup.inline_keyboard[0]?.[0]?.callback_data).toBe("messages:select:0");
    expect(options.reply_markup.inline_keyboard[0]?.[0]?.text).toContain("[14:05] newer prompt with line break");

    const state = interactionManager.getSnapshot(mocked.scopeKey);
    expect(state?.metadata.flow).toBe("messages");
    expect(state?.metadata.projectId).toBe("project-1");
  });

  it("reverts message successfully", async () => {
    interactionManager.start(
      {
        kind: "custom",
        expectedInput: "callback",
        metadata: {
          flow: "messages",
          stage: "detail",
          messageId: 600,
          projectId: "project-1",
          projectDirectory: "/repo",
          sessionId: "session-1",
          messages: [{ id: "msg-1", text: "test prompt", created: 1000 }],
          page: 0,
          selectedIndex: 0,
        },
      },
      mocked.scopeKey,
    );

    mocked.sessionRevertMock.mockResolvedValue({});
    const ctx = createCallbackContext("messages:revert", 600);
    const handled = await handleMessagesCallback(ctx, {
      ensureEventSubscription: vi.fn().mockResolvedValue(undefined),
    });

    expect(handled).toBe(true);
    expect(mocked.sessionRevertMock).toHaveBeenCalledWith({
      sessionID: "session-1",
      directory: "/repo",
      messageID: "msg-1",
    });
    expect(ctx.editMessageText).toHaveBeenCalledWith(
      t("messages.revert_success", { text: "test prompt" }),
      { reply_markup: undefined },
    );
  });

  it("forks a session in non-forum chats by switching the current scoped session", async () => {
    mocked.scope = { key: "dm:1", chatId: 1, threadId: null, context: "dm" };
    mocked.scopeKey = "dm:1";

    interactionManager.start(
      {
        kind: "custom",
        expectedInput: "callback",
        metadata: {
          flow: "messages",
          stage: "detail",
          messageId: 601,
          projectId: "project-1",
          projectDirectory: "/repo",
          sessionId: "session-1",
          messages: [{ id: "msg-1", text: "test prompt", created: 1000 }],
          page: 0,
          selectedIndex: 0,
        },
      },
      mocked.scopeKey,
    );

    mocked.sessionForkMock.mockResolvedValue({
      data: { id: "session-2", title: "Forked Session", directory: "/repo" },
      error: null,
    });

    const ctx = createCallbackContext("messages:fork", 601);
    ctx.chat = { id: 1, type: "private" } as never;
    const ensureEventSubscription = vi.fn().mockResolvedValue(undefined);
    const handled = await handleMessagesCallback(ctx, { ensureEventSubscription });

    expect(handled).toBe(true);
    expect(mocked.setCurrentSessionMock).toHaveBeenCalledWith({
      id: "session-2",
      title: "Forked Session",
      directory: "/repo",
    }, "dm:1");
    expect(ensureEventSubscription).toHaveBeenCalledWith("/repo");
    expect(ctx.reply).toHaveBeenCalledWith(
      t("sessions.selected", { title: "Forked Session" }),
      expect.objectContaining({ reply_markup: { keyboard: true } }),
    );
  });

  it("forks a session in forum chats by creating a new topic", async () => {
    interactionManager.start(
      {
        kind: "custom",
        expectedInput: "callback",
        metadata: {
          flow: "messages",
          stage: "detail",
          messageId: 602,
          projectId: "project-1",
          projectDirectory: "/repo",
          sessionId: "session-1",
          messages: [{ id: "msg-1", text: "test prompt", created: 1000 }],
          page: 0,
          selectedIndex: 0,
        },
      },
      mocked.scopeKey,
    );

    mocked.sessionForkMock.mockResolvedValue({
      data: { id: "session-2", title: "Forked Session", directory: "/repo" },
      error: null,
    });

    const ctx = createCallbackContext("messages:fork", 602);
    const ensureEventSubscription = vi.fn().mockResolvedValue(undefined);
    const handled = await handleMessagesCallback(ctx, { ensureEventSubscription });

    expect(handled).toBe(true);
    expect(ctx.api.createForumTopic).toHaveBeenCalled();
    expect(mocked.registerTopicSessionBindingMock).toHaveBeenCalled();
    expect(mocked.setCurrentProjectMock).toHaveBeenCalled();
  });
});

describe("messages pagination helpers", () => {
  it("parses valid page callbacks", () => {
    expect(parseMessagePageCallback("messages:page:0")).toBe(0);
    expect(parseMessagePageCallback("messages:page:2")).toBe(2);
  });

  it("calculates pagination bounds", () => {
    expect(calculateMessagesPaginationRange(25, 1, 10)).toEqual({
      page: 1,
      totalPages: 3,
      startIndex: 10,
      endIndex: 20,
    });
  });
});
