import dotenv from "dotenv";
import { getRuntimePaths } from "./runtime/paths.js";
import { normalizeLocale, type Locale } from "./i18n/index.js";

const runtimePaths = getRuntimePaths();
dotenv.config({ path: runtimePaths.envFilePath, quiet: true });

export type MessageFormatMode = "raw" | "markdown";

export function buildTelegramConfig(): {
  token: string;
  allowedUserId: number;
  proxyUrl: string;
  apiRoot: string;
  proxySecret: string;
  forceIpv4: boolean;
} {
  const proxyUrl = getEnvVar("TELEGRAM_PROXY_URL", false);
  const apiRoot = getEnvVar("TELEGRAM_API_ROOT", false).replace(/\/+$/, "");
  const proxySecret = getEnvVar("TELEGRAM_PROXY_SECRET", false);
  const forceIpv4 = getOptionalBooleanEnvVar("TELEGRAM_FORCE_IPV4", false);

  if (proxyUrl && apiRoot) {
    throw new Error(
      "TELEGRAM_PROXY_URL and TELEGRAM_API_ROOT are alternative connectivity modes and cannot be used together.",
    );
  }

  if (proxySecret && !apiRoot) {
    throw new Error("TELEGRAM_PROXY_SECRET requires TELEGRAM_API_ROOT to be set.");
  }

  return {
    token: getEnvVar("TELEGRAM_BOT_TOKEN"),
    allowedUserId: parseInt(getEnvVar("TELEGRAM_ALLOWED_USER_ID"), 10),
    proxyUrl,
    apiRoot,
    proxySecret,
    forceIpv4,
  };
}

function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key} (expected in ${runtimePaths.envFilePath})`,
    );
  }
  return value || "";
}

function getOptionalPositiveIntEnvVar(key: string, defaultValue: number): number {
  const value = getEnvVar(key, false);

  if (!value) {
    return defaultValue;
  }

  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return defaultValue;
  }

  return parsedValue;
}

function getOptionalNonNegativeIntEnvVarFromKeys(keys: string[], defaultValue: number): number {
  for (const key of keys) {
    const value = getEnvVar(key, false);
    if (!value) {
      continue;
    }

    const parsedValue = Number.parseInt(value, 10);
    if (Number.isNaN(parsedValue) || parsedValue < 0) {
      return defaultValue;
    }

    return parsedValue;
  }

  return defaultValue;
}

function getOptionalLocaleEnvVar(key: string, defaultValue: Locale): Locale {
  const value = getEnvVar(key, false);
  return normalizeLocale(value, defaultValue);
}

function getOptionalBooleanEnvVar(key: string, defaultValue: boolean): boolean {
  const value = getEnvVar(key, false);

  if (!value) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

function getOptionalMessageFormatModeEnvVar(
  key: string,
  defaultValue: MessageFormatMode,
): MessageFormatMode {
  const value = getEnvVar(key, false);

  if (!value) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "raw" || normalized === "markdown") {
    return normalized;
  }

  return defaultValue;
}

export const config = {
  telegram: buildTelegramConfig(),
  opencode: {
    apiUrl: getEnvVar("OPENCODE_API_URL", false) || "http://localhost:4096",
    username: getEnvVar("OPENCODE_SERVER_USERNAME", false) || "opencode",
    password: getEnvVar("OPENCODE_SERVER_PASSWORD", false),
    model: {
      provider: getEnvVar("OPENCODE_MODEL_PROVIDER", true), // Required
      modelId: getEnvVar("OPENCODE_MODEL_ID", true), // Required
    },
  },
  server: {
    logLevel: getEnvVar("LOG_LEVEL", false) || "info",
  },
  bot: {
    sessionsListLimit: getOptionalPositiveIntEnvVar("SESSIONS_LIST_LIMIT", 10),
    messagesListLimit: getOptionalPositiveIntEnvVar("MESSAGES_LIST_LIMIT", 10),
    projectsListLimit: getOptionalPositiveIntEnvVar("PROJECTS_LIST_LIMIT", 10),
    commandsListLimit: getOptionalPositiveIntEnvVar("COMMANDS_LIST_LIMIT", 10),
    openBrowserRoots: getEnvVar("OPEN_BROWSER_ROOTS", false),
    responseStreamThrottleMs: getOptionalPositiveIntEnvVar("RESPONSE_STREAM_THROTTLE_MS", 1000),
    bashToolDisplayMaxLength: getOptionalPositiveIntEnvVar("BASH_TOOL_DISPLAY_MAX_LENGTH", 128),
    scheduledTaskExecutionTimeoutMinutes: getOptionalPositiveIntEnvVar(
      "SCHEDULED_TASK_EXECUTION_TIMEOUT_MINUTES",
      120,
    ),
    scheduledTasksPollIntervalSec: getOptionalPositiveIntEnvVar(
      "SCHEDULED_TASK_POLL_INTERVAL_SEC",
      30,
    ),
    locale: getOptionalLocaleEnvVar("BOT_LOCALE", "en"),
    serviceMessagesIntervalSec: getOptionalNonNegativeIntEnvVarFromKeys(
      ["SERVICE_MESSAGES_INTERVAL_SEC", "TOOL_MESSAGES_INTERVAL_SEC"],
      5,
    ),
    hideThinkingMessages: getOptionalBooleanEnvVar("HIDE_THINKING_MESSAGES", false),
    hideToolCallMessages: getOptionalBooleanEnvVar("HIDE_TOOL_CALL_MESSAGES", false),
    hideToolFileMessages: getOptionalBooleanEnvVar("HIDE_TOOL_FILE_MESSAGES", false),
    messageFormatMode: getOptionalMessageFormatModeEnvVar("MESSAGE_FORMAT_MODE", "markdown"),
  },
  files: {
    maxFileSizeKb: parseInt(getEnvVar("CODE_FILE_MAX_SIZE_KB", false) || "100", 10),
  },
  stt: {
    apiUrl: getEnvVar("STT_API_URL", false),
    apiKey: getEnvVar("STT_API_KEY", false),
    model: getEnvVar("STT_MODEL", false) || "whisper-large-v3-turbo",
    language: getEnvVar("STT_LANGUAGE", false),
    notePrompt: getEnvVar("STT_NOTE_PROMPT", false),
  },
  tts: {
    apiUrl: getEnvVar("TTS_API_URL", false),
    apiKey: getEnvVar("TTS_API_KEY", false),
    model: getEnvVar("TTS_MODEL", false) || "gpt-4o-mini-tts",
    voice: getEnvVar("TTS_VOICE", false) || "alloy",
  },
};
