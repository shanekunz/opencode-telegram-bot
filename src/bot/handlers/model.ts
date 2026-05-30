import { Context, InlineKeyboard } from "grammy";
import {
  selectModel,
  fetchCurrentModel,
  getModelSelectionLists,
  searchModels,
} from "../../model/manager.js";
import { formatModelForDisplay } from "../../model/types.js";
import type { FavoriteModel, ModelInfo, ModelSelectionLists } from "../../model/types.js";
import { formatVariantForButton } from "../../variant/manager.js";
import { logger } from "../../utils/logger.js";
import { createMainKeyboard } from "../utils/keyboard.js";
import { getStoredAgent, resolveProjectAgent } from "../../agent/manager.js";
import { pinnedMessageManager } from "../../pinned/manager.js";
import { keyboardManager } from "../../keyboard/manager.js";
import {
  clearActiveInlineMenu,
  ensureActiveInlineMenu,
  replyWithInlineMenu,
} from "./inline-menu.js";
import { interactionManager } from "../../interaction/manager.js";
import { t } from "../../i18n/index.js";
import {
  SCOPE_CONTEXT,
  getScopeFromContext,
  getScopeFromKey,
  getScopeKeyFromContext,
  getThreadSendOptions,
} from "../scope.js";

const MODEL_SEARCH_CALLBACK = "model:search";
const MODEL_SEARCH_AGAIN_CALLBACK = "model:search:again";
const MODEL_SEARCH_CANCEL_CALLBACK = "model:search:cancel";

function buildModelSelectionMenuText(modelLists: ModelSelectionLists): string {
  const lines = [t("model.menu.select"), t("model.menu.favorites_title")];

  if (modelLists.favorites.length === 0) {
    lines.push(t("model.menu.favorites_empty"));
  }

  lines.push(t("model.menu.recent_title"));

  if (modelLists.recent.length === 0) {
    lines.push(t("model.menu.recent_empty"));
  }

  return lines.join("\n");
}

interface ModelSearchMetadata {
  flow: string;
  stage: string;
  messageId?: number;
}

function parseModelSearchMetadata(scopeKey: string): ModelSearchMetadata | null {
  const state = interactionManager.getSnapshot(scopeKey);
  if (!state || state.kind !== "custom") {
    return null;
  }

  const flow = state.metadata.flow;
  const stage = state.metadata.stage;

  if (flow !== "model-search" || typeof stage !== "string") {
    return null;
  }

  const messageId =
    typeof state.metadata.messageId === "number" ? state.metadata.messageId : undefined;

  return { flow, stage, messageId };
}

async function applyModelSelectionAndNotify(ctx: Context, modelInfo: ModelInfo): Promise<void> {
  const scopeKey = getScopeKeyFromContext(ctx);

  if (ctx.chat) {
    keyboardManager.initialize(ctx.api, ctx.chat.id, scopeKey);
  }

  selectModel(modelInfo, scopeKey);
  keyboardManager.updateModel(modelInfo, scopeKey);
  await pinnedMessageManager.refreshContextLimit(scopeKey);

  const currentAgent = await resolveProjectAgent(getStoredAgent(scopeKey), scopeKey);
  const contextInfo =
    pinnedMessageManager.getContextInfo(scopeKey) ??
    (pinnedMessageManager.getContextLimit(scopeKey) > 0
      ? { tokensUsed: 0, tokensLimit: pinnedMessageManager.getContextLimit(scopeKey) }
      : keyboardManager.getContextInfo(scopeKey));

  if (contextInfo) {
    keyboardManager.updateContext(contextInfo.tokensUsed, contextInfo.tokensLimit, scopeKey);
  }
  keyboardManager.updateAgent(currentAgent, scopeKey);

  const variantName = formatVariantForButton(modelInfo.variant || "default");
  const scope = getScopeFromKey(scopeKey);
  const keyboard = createMainKeyboard(
    currentAgent,
    modelInfo,
    contextInfo ?? undefined,
    variantName,
    scope?.context === SCOPE_CONTEXT.GROUP_GENERAL
      ? {
          contextFirst: true,
          contextLabel: t("keyboard.general_defaults"),
        }
      : undefined,
  );
  const displayName = formatModelForDisplay(modelInfo.providerID, modelInfo.modelID);
  const threadId = getScopeFromContext(ctx)?.threadId ?? null;

  await ctx.answerCallbackQuery({ text: t("model.changed_callback", { name: displayName }) });
  await ctx.reply(t("model.changed_message", { name: displayName }), {
    reply_markup: keyboard,
    ...getThreadSendOptions(threadId),
  });
  await ctx.deleteMessage().catch(() => {});
}

/**
 * Handle model selection callback
 * @param ctx grammY context
 * @returns true if handled, false otherwise
 */
export async function handleModelSelect(ctx: Context): Promise<boolean> {
  const callbackQuery = ctx.callbackQuery;

  if (!callbackQuery?.data || !callbackQuery.data.startsWith("model:")) {
    return false;
  }

  if (
    callbackQuery.data === MODEL_SEARCH_CALLBACK ||
    callbackQuery.data === MODEL_SEARCH_AGAIN_CALLBACK ||
    callbackQuery.data === MODEL_SEARCH_CANCEL_CALLBACK
  ) {
    return false;
  }

  const isActiveMenu = await ensureActiveInlineMenu(ctx, "model");
  if (!isActiveMenu) {
    return true;
  }

  logger.debug(`[ModelHandler] Received callback: ${callbackQuery.data}`);

  try {
    const scopeKey = getScopeKeyFromContext(ctx);

    // Parse callback data: "model:providerID:modelID"
    const parts = callbackQuery.data.split(":");
    if (parts.length < 3) {
      logger.error(`[ModelHandler] Invalid callback data format: ${callbackQuery.data}`);
      clearActiveInlineMenu("model_select_invalid_callback", scopeKey);
      await ctx.answerCallbackQuery({ text: t("model.change_error_callback") }).catch(() => {});
      return true;
    }

    const providerID = parts[1];
    const modelID = parts.slice(2).join(":"); // Handle model IDs that may contain ":"

    const modelInfo: ModelInfo = {
      providerID,
      modelID,
      variant: "default", // Reset to default when switching models
    };

    clearActiveInlineMenu("model_selected", scopeKey);
    await applyModelSelectionAndNotify(ctx, modelInfo);

    return true;
  } catch (err) {
    clearActiveInlineMenu("model_select_error", getScopeKeyFromContext(ctx));
    logger.error("[ModelHandler] Error handling model select:", err);
    await ctx.answerCallbackQuery({ text: t("model.change_error_callback") }).catch(() => {});
    return false;
  }
}

/**
 * Build inline keyboard with favorite and recent models
 * @param currentModel Current model for highlighting
 * @returns InlineKeyboard with model selection buttons
 */
export async function buildModelSelectionMenu(
  currentModel?: ModelInfo,
  modelLists?: ModelSelectionLists,
): Promise<InlineKeyboard> {
  const keyboard = new InlineKeyboard();
  const lists = modelLists ?? (await getModelSelectionLists());
  const favorites = lists.favorites;
  const recent = lists.recent;

  keyboard.text(t("model.search.button"), MODEL_SEARCH_CALLBACK).row();

  if (favorites.length === 0 && recent.length === 0) {
    logger.warn("[ModelHandler] No model choices found in favorites/recent");
    return keyboard;
  }

  const addButton = (model: FavoriteModel, prefix: string): void => {
    const isActive =
      currentModel &&
      model.providerID === currentModel.providerID &&
      model.modelID === currentModel.modelID;

    // Inline buttons use full model ID without truncation
    const label = `${prefix} ${model.providerID}/${model.modelID}`;
    const labelWithCheck = isActive ? `✅ ${label}` : label;

    keyboard.text(labelWithCheck, `model:${model.providerID}:${model.modelID}`).row();
  };

  favorites.forEach((model) => addButton(model, "⭐"));
  recent.forEach((model) => addButton(model, "🕘"));

  return keyboard;
}

/**
 * Show model selection menu
 * @param ctx grammY context
 */
export async function showModelSelectionMenu(ctx: Context): Promise<void> {
  try {
    const threadId = getScopeFromContext(ctx)?.threadId ?? null;
    const scopeKey = getScopeKeyFromContext(ctx);
    const currentModel = fetchCurrentModel(scopeKey);
    const modelLists = await getModelSelectionLists();
    const keyboard = await buildModelSelectionMenu(currentModel, modelLists);

    if (keyboard.inline_keyboard.length === 0) {
      await ctx.reply(t("model.menu.empty"), getThreadSendOptions(threadId));
      return;
    }

    const text = buildModelSelectionMenuText(modelLists);

    await replyWithInlineMenu(ctx, {
      menuKind: "model",
      text,
      keyboard,
    });
  } catch (err) {
    logger.error("[ModelHandler] Error showing model menu:", err);
    await ctx.reply(
      t("model.menu.error"),
      getThreadSendOptions(getScopeFromContext(ctx)?.threadId ?? null),
    );
  }
}

export async function handleModelSearchCallback(ctx: Context): Promise<boolean> {
  const data = ctx.callbackQuery?.data;
  if (data !== MODEL_SEARCH_CALLBACK) {
    return false;
  }

  const scopeKey = getScopeKeyFromContext(ctx);
  const isActive = await ensureActiveInlineMenu(ctx, "model");
  if (!isActive) {
    return true;
  }

  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.deleteMessage().catch(() => {});

  interactionManager.start(
    {
      kind: "custom",
      expectedInput: "text",
      metadata: {
        flow: "model-search",
        stage: "input",
      },
    },
    scopeKey,
  );

  await ctx.reply(
    t("model.search.prompt"),
    getThreadSendOptions(getScopeFromContext(ctx)?.threadId ?? null),
  );
  return true;
}

export async function handleModelSearchTextInput(ctx: Context): Promise<boolean> {
  const scopeKey = getScopeKeyFromContext(ctx);
  const metadata = parseModelSearchMetadata(scopeKey);
  if (!metadata || metadata.stage !== "input") {
    return false;
  }

  const text = ctx.message?.text;
  if (!text) {
    return false;
  }

  try {
    const results = await searchModels(text);
    const keyboard = new InlineKeyboard();

    for (const model of results) {
      keyboard.text(`${model.providerID}/${model.modelID}`, `model:${model.providerID}:${model.modelID}`).row();
    }

    keyboard.row();
    keyboard.text(t("model.search.search_again"), MODEL_SEARCH_AGAIN_CALLBACK);
    keyboard.text(t("inline.button.cancel"), MODEL_SEARCH_CANCEL_CALLBACK);

    const replyText =
      results.length === 0
        ? t("model.search.no_results", { query: text })
        : t("model.search.results_title", { query: text });

    const sent = await ctx.reply(replyText, {
      reply_markup: keyboard,
      ...getThreadSendOptions(getScopeFromContext(ctx)?.threadId ?? null),
    });

    interactionManager.transition(
      {
        expectedInput: "callback",
        metadata: {
          flow: "model-search",
          stage: "results",
          messageId: sent.message_id,
        },
      },
      scopeKey,
    );

    return true;
  } catch (err) {
    logger.error("[ModelHandler] Model search error:", err);
    await ctx.reply(
      t("model.search.error"),
      getThreadSendOptions(getScopeFromContext(ctx)?.threadId ?? null),
    );
    interactionManager.clear("model_search_error", scopeKey);
    return true;
  }
}

export async function handleModelSearchResults(ctx: Context): Promise<boolean> {
  const data = ctx.callbackQuery?.data;
  if (!data) {
    return false;
  }

  const scopeKey = getScopeKeyFromContext(ctx);
  const metadata = parseModelSearchMetadata(scopeKey);
  if (!metadata || metadata.stage !== "results") {
    return false;
  }

  const callbackMessageId =
    ctx.callbackQuery?.message && "message_id" in ctx.callbackQuery.message
      ? ctx.callbackQuery.message.message_id
      : undefined;

  if (metadata.messageId !== undefined && callbackMessageId !== metadata.messageId) {
    await ctx
      .answerCallbackQuery({ text: t("inline.inactive_callback"), show_alert: true })
      .catch(() => {});
    return true;
  }

  if (data === MODEL_SEARCH_CANCEL_CALLBACK) {
    interactionManager.clear("model_search_cancelled", scopeKey);
    await ctx.answerCallbackQuery({ text: t("inline.cancelled_callback") }).catch(() => {});
    await ctx.deleteMessage().catch(() => {});
    return true;
  }

  if (data === MODEL_SEARCH_AGAIN_CALLBACK) {
    await ctx.answerCallbackQuery().catch(() => {});
    await ctx.deleteMessage().catch(() => {});
    interactionManager.start(
      {
        kind: "custom",
        expectedInput: "text",
        metadata: {
          flow: "model-search",
          stage: "input",
        },
      },
      scopeKey,
    );
    await ctx.reply(
      t("model.search.prompt"),
      getThreadSendOptions(getScopeFromContext(ctx)?.threadId ?? null),
    );
    return true;
  }

  if (data.startsWith("model:")) {
    const parts = data.split(":");
    if (parts.length < 3) {
      return true;
    }

    const providerID = parts[1];
    const modelID = parts.slice(2).join(":");

    interactionManager.clear("model_search_selected", scopeKey);
    await applyModelSelectionAndNotify(ctx, {
      providerID,
      modelID,
      variant: "default",
    });
    return true;
  }

  return false;
}
