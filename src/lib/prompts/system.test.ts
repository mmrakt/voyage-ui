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

  it("includes current date in prompt", () => {
    const prompt = getSystemPrompt(true);
    // 日付フォーマット: YYYY年M月D日（曜日）
    expect(prompt).toMatch(
      /今日の日付は\d{4}年\d{1,2}月\d{1,2}日（[日月火水木金土]）です/,
    );
  });

  it("includes current date in both prompts", () => {
    const withTools = getSystemPrompt(true);
    const withoutTools = getSystemPrompt(false);
    const datePattern =
      /今日の日付は\d{4}年\d{1,2}月\d{1,2}日（[日月火水木金土]）です/;
    expect(withTools).toMatch(datePattern);
    expect(withoutTools).toMatch(datePattern);
  });
});
