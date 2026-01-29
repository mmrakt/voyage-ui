import { describe, expect, it } from "vitest";
import { getSystemPrompt } from "./system";

describe("getSystemPrompt", () => {
  it("returns prompt with tools instructions when supportsTools is true", () => {
    const prompt = getSystemPrompt(true);
    expect(prompt).toContain("searchFlightsツール");
  });

  it("returns prompt without tools instructions when supportsTools is false", () => {
    const prompt = getSystemPrompt(false);
    expect(prompt).toContain("フライト検索機能が利用できません");
    expect(prompt).not.toContain("searchFlightsツール");
  });

  it("always includes Japanese response instruction", () => {
    expect(getSystemPrompt(true)).toContain("日本語で応答");
    expect(getSystemPrompt(false)).toContain("日本語で応答");
  });
});
