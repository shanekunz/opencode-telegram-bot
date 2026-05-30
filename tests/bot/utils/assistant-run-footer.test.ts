import { describe, expect, it } from "vitest";
import { formatAssistantRunFooter } from "../../../src/bot/utils/assistant-run-footer.js";

describe("bot/utils/assistant-run-footer", () => {
  it("formats agent, model, and elapsed time", () => {
    const footer = formatAssistantRunFooter(
      {
        sessionId: "s1",
        startedAt: 1000,
        configuredAgent: "build",
        configuredProviderID: "openai",
        configuredModelID: "gpt-5",
      },
      3500,
    );

    expect(footer).toBe("🛠️ Build · 🤖 openai/gpt-5 · 🕒 2s");
  });

  it("formats longer durations with minutes and hours", () => {
    const footer = formatAssistantRunFooter(
      {
        sessionId: "s1",
        startedAt: 0,
        configuredAgent: "build",
        configuredProviderID: "openai",
        configuredModelID: "gpt-5",
      },
      3_661_000,
    );

    expect(footer).toBe("🛠️ Build · 🤖 openai/gpt-5 · 🕒 1h 1m 1s");
  });
});
