import path from "node:path";
import { config } from "../config.js";
import { opencodeClient } from "../opencode/client.js";
import { getCurrentModel, getScopedModels, setCurrentModel } from "../settings/manager.js";
import { logger } from "../utils/logger.js";
import type { FavoriteModel, ModelInfo, ModelSelectionLists } from "./types.js";

interface OpenCodeModelState {
  favorite?: Array<{ providerID?: string; modelID?: string }>;
  recent?: Array<{ providerID?: string; modelID?: string }>;
}

const MODEL_CATALOG_CACHE_TTL_MS = 10 * 60 * 1000;
const SEARCH_RESULTS_LIMIT = 10;

let cachedValidModelKeys: Set<string> | null = null;
let cachedAllModels: FavoriteModel[] | null = null;
let modelCatalogCacheExpiresAt = 0;
let modelCatalogFetchInFlight: Promise<Set<string> | null> | null = null;

function getModelKey(providerID: string, modelID: string): string {
  return `${providerID}/${modelID}`;
}

function getEnvDefaultModel(): FavoriteModel | null {
  const providerID = config.opencode.model.provider;
  const modelID = config.opencode.model.modelId;

  if (!providerID || !modelID) {
    return null;
  }

  return { providerID, modelID };
}

function dedupeModels(models: FavoriteModel[]): FavoriteModel[] {
  const unique = new Map<string, FavoriteModel>();

  for (const model of models) {
    const key = `${model.providerID}/${model.modelID}`;
    if (!unique.has(key)) {
      unique.set(key, model);
    }
  }

  return Array.from(unique.values());
}

function filterModelsByCatalog(
  models: FavoriteModel[],
  validModelKeys: Set<string> | null,
): FavoriteModel[] {
  if (!validModelKeys) {
    return models;
  }

  return models.filter((model) => validModelKeys.has(getModelKey(model.providerID, model.modelID)));
}

async function getValidModelKeys(): Promise<Set<string> | null> {
  if (cachedValidModelKeys && Date.now() < modelCatalogCacheExpiresAt) {
    logger.debug(
      `[ModelManager] Model catalog cache hit: models=${cachedValidModelKeys.size}, ttlMs=${modelCatalogCacheExpiresAt - Date.now()}`,
    );
    return cachedValidModelKeys;
  }

  if (modelCatalogFetchInFlight) {
    logger.debug("[ModelManager] Awaiting in-flight model catalog refresh");
    return modelCatalogFetchInFlight;
  }

  modelCatalogFetchInFlight = (async () => {
    try {
      logger.debug("[ModelManager] Refreshing model catalog from OpenCode API");
      const response = await opencodeClient.config.providers();

      if (response.error || !response.data) {
        logger.warn("[ModelManager] Failed to refresh model catalog:", response.error);

        if (cachedValidModelKeys) {
          logger.warn("[ModelManager] Using stale model catalog cache after refresh failure");
          return cachedValidModelKeys;
        }

        return null;
      }

      const validModelKeys = new Set<string>();
      const allModels: FavoriteModel[] = [];

      for (const provider of response.data.providers) {
        for (const modelID of Object.keys(provider.models)) {
          validModelKeys.add(getModelKey(provider.id, modelID));
          allModels.push({ providerID: provider.id, modelID });
        }
      }

      cachedValidModelKeys = validModelKeys;
      cachedAllModels = allModels;
      modelCatalogCacheExpiresAt = Date.now() + MODEL_CATALOG_CACHE_TTL_MS;

      logger.debug(
        `[ModelManager] Model catalog refreshed: providers=${response.data.providers.length}, models=${validModelKeys.size}`,
      );

      return cachedValidModelKeys;
    } catch (err) {
      logger.warn("[ModelManager] Error refreshing model catalog:", err);

      if (cachedValidModelKeys) {
        logger.warn("[ModelManager] Using stale model catalog cache after refresh exception");
        return cachedValidModelKeys;
      }

      return null;
    } finally {
      modelCatalogFetchInFlight = null;
    }
  })();

  return modelCatalogFetchInFlight;
}

function normalizeFavoriteModels(state: OpenCodeModelState): FavoriteModel[] {
  if (!Array.isArray(state.favorite)) {
    return [];
  }

  return state.favorite
    .filter(
      (model): model is { providerID: string; modelID: string } =>
        typeof model?.providerID === "string" &&
        model.providerID.length > 0 &&
        typeof model.modelID === "string" &&
        model.modelID.length > 0,
    )
    .map((model) => ({
      providerID: model.providerID,
      modelID: model.modelID,
    }));
}

function normalizeRecentModels(state: OpenCodeModelState): FavoriteModel[] {
  if (!Array.isArray(state.recent)) {
    return [];
  }

  return state.recent
    .filter(
      (model): model is { providerID: string; modelID: string } =>
        typeof model?.providerID === "string" &&
        model.providerID.length > 0 &&
        typeof model.modelID === "string" &&
        model.modelID.length > 0,
    )
    .map((model) => ({
      providerID: model.providerID,
      modelID: model.modelID,
    }));
}

function getOpenCodeModelStatePath(): string {
  const xdgStateHome = process.env.XDG_STATE_HOME;

  if (xdgStateHome && xdgStateHome.trim().length > 0) {
    return path.join(xdgStateHome, "opencode", "model.json");
  }

  const homeDir = process.env.HOME || process.env.USERPROFILE || "";
  return path.join(homeDir, ".local", "state", "opencode", "model.json");
}

/**
 * Get favorite and recent models from OpenCode local state file.
 * Config model is always treated as favorite.
 */
export async function getModelSelectionLists(): Promise<ModelSelectionLists> {
  const envDefaultModel = getEnvDefaultModel();

  try {
    const fs = await import("fs/promises");

    const stateFilePath = getOpenCodeModelStatePath();
    const content = await fs.readFile(stateFilePath, "utf-8");
    const state = JSON.parse(content) as OpenCodeModelState;

    const rawFavorites = normalizeFavoriteModels(state);
    const rawRecent = normalizeRecentModels(state);
    const shouldValidateWithCatalog = rawFavorites.length > 0 || rawRecent.length > 0;
    const validModelKeys = shouldValidateWithCatalog ? await getValidModelKeys() : null;

    const validatedFavorites = filterModelsByCatalog(rawFavorites, validModelKeys);
    const validatedRecent = filterModelsByCatalog(rawRecent, validModelKeys);

    const favorites = envDefaultModel
      ? dedupeModels([...validatedFavorites, envDefaultModel])
      : validatedFavorites;

    if (rawFavorites.length === 0 && envDefaultModel) {
      logger.info(
        `[ModelManager] No favorites in ${stateFilePath}, using config model as favorite`,
      );
    }

    if (favorites.length === 0) {
      logger.warn(`[ModelManager] No favorites in ${stateFilePath}`);
    }

    const filteredOutFavorites = rawFavorites.length - validatedFavorites.length;
    const filteredOutRecent = rawRecent.length - validatedRecent.length;

    if (filteredOutFavorites > 0 || filteredOutRecent > 0) {
      logger.info(
        `[ModelManager] Filtered unavailable models from OpenCode state: favoritesRemoved=${filteredOutFavorites}, recentRemoved=${filteredOutRecent}`,
      );
    }

    const favoriteKeys = new Set(
      favorites.map((model) => getModelKey(model.providerID, model.modelID)),
    );
    const recent = dedupeModels(validatedRecent).filter(
      (model) => !favoriteKeys.has(getModelKey(model.providerID, model.modelID)),
    );

    logger.debug(
      `[ModelManager] Loaded model selection lists from ${stateFilePath}: favorites=${favorites.length}, recent=${recent.length}`,
    );

    return { favorites, recent };
  } catch (err) {
    if (envDefaultModel) {
      logger.warn(
        "[ModelManager] Failed to load OpenCode model state, using config model as favorite:",
        err,
      );
      return {
        favorites: [envDefaultModel],
        recent: [],
      };
    }

    logger.error("[ModelManager] Failed to load OpenCode model state:", err);
    return {
      favorites: [],
      recent: [],
    };
  }
}

export async function reconcileStoredModelSelection(): Promise<void> {
  const scopedEntries = Object.entries(getScopedModels()).filter(([, model]) =>
    Boolean(model?.providerID && model.modelID),
  );

  if (scopedEntries.length === 0) {
    return;
  }

  const validModelKeys = await getValidModelKeys();

  if (!validModelKeys) {
    logger.warn("[ModelManager] Skipping stored model validation: model catalog unavailable");
    return;
  }

  const envDefaultModel = getEnvDefaultModel();
  if (!envDefaultModel) {
    logger.warn(
      "[ModelManager] Cannot reconcile unavailable stored models: env default model is missing",
    );
    return;
  }

  const fallbackModel: ModelInfo = {
    providerID: envDefaultModel.providerID,
    modelID: envDefaultModel.modelID,
    variant: "default",
  };

  for (const [scopeKey, model] of scopedEntries) {
    const currentModelKey = getModelKey(model.providerID, model.modelID);

    if (validModelKeys.has(currentModelKey)) {
      continue;
    }

    logger.warn(
      `[ModelManager] Stored model ${currentModelKey} is unavailable in scope ${scopeKey}, falling back to ${fallbackModel.providerID}/${fallbackModel.modelID}`,
    );
    setCurrentModel({ ...fallbackModel }, scopeKey);
  }
}

export function __resetModelCatalogCacheForTests(): void {
  cachedValidModelKeys = null;
  cachedAllModels = null;
  modelCatalogCacheExpiresAt = 0;
  modelCatalogFetchInFlight = null;
}

export async function searchModels(query: string): Promise<FavoriteModel[]> {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const validModelKeys = await getValidModelKeys();
  if (!validModelKeys || !cachedAllModels) {
    logger.warn("[ModelManager] Model catalog unavailable, skipping search");
    return [];
  }

  const results = cachedAllModels
    .filter((model) => getModelKey(model.providerID, model.modelID).toLowerCase().includes(normalizedQuery))
    .sort((left, right) =>
      getModelKey(left.providerID, left.modelID)
        .toLowerCase()
        .localeCompare(getModelKey(right.providerID, right.modelID).toLowerCase()),
    )
    .slice(0, SEARCH_RESULTS_LIMIT);

  logger.debug(`[ModelManager] Model search: query="${query}", results=${results.length}`);
  return results;
}

/**
 * Get list of favorite models from OpenCode local state file
 * Falls back to env default model if file is unavailable or empty
 */
export async function getFavoriteModels(): Promise<FavoriteModel[]> {
  const { favorites } = await getModelSelectionLists();
  return favorites;
}

/**
 * Get current model from settings or fallback to config
 * @returns Current model info
 */
export function fetchCurrentModel(scopeKey: string = "global"): ModelInfo {
  return getStoredModel(scopeKey);
}

/**
 * Select model and persist to settings
 * @param modelInfo Model to select
 */
export function selectModel(modelInfo: ModelInfo, scopeKey: string = "global"): void {
  logger.info(`[ModelManager] Selected model: ${modelInfo.providerID}/${modelInfo.modelID}`);
  setCurrentModel(modelInfo, scopeKey);
}

/**
 * Get stored model from settings (synchronous)
 * ALWAYS returns a model - fallback to config if not found
 * @returns Current model info
 */
export function getStoredModel(scopeKey: string = "global"): ModelInfo {
  const storedModel = getCurrentModel(scopeKey);

  if (storedModel) {
    // Ensure variant is set (default to "default")
    if (!storedModel.variant) {
      storedModel.variant = "default";
    }
    return storedModel;
  }

  // Fallback to model from config (environment variables)
  if (config.opencode.model.provider && config.opencode.model.modelId) {
    logger.debug("[ModelManager] Using model from config");
    return {
      providerID: config.opencode.model.provider,
      modelID: config.opencode.model.modelId,
      variant: "default",
    };
  }

  // This should not happen if config is properly set
  logger.warn("[ModelManager] No model found in settings or config, returning empty model");
  return {
    providerID: "",
    modelID: "",
    variant: "default",
  };
}
