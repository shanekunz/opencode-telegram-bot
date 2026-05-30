import { getAgentDisplayName } from "../../agent/types.js";
import type { AssistantRunInfo } from "../assistant-run-state.js";

function formatElapsedSeconds(elapsedMs: number): string {
  const safeElapsedMs = Math.max(0, Math.round(elapsedMs));
  const totalSeconds = Math.floor(safeElapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ");
}

export function formatAssistantRunFooter(run: AssistantRunInfo, finishedAt = Date.now()): string {
  const agent = run.configuredAgent ? getAgentDisplayName(run.configuredAgent) : "🤖 Assistant";
  const providerID = run.configuredProviderID ?? "unknown";
  const modelID = run.configuredModelID ?? "unknown";
  return `${agent} · 🤖 ${providerID}/${modelID} · 🕒 ${formatElapsedSeconds(finishedAt - run.startedAt)}`;
}
