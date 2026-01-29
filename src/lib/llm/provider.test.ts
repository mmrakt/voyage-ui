import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LLMProvider } from "./provider";

const mockEnv = vi.hoisted(() => ({
  OPENROUTER_API_KEY: "test-key",
  LLM_PROVIDER: "claude" as LLMProvider,
  USE_MOCK_API: true,
  NODE_ENV: "test" as const,
}));

vi.mock("@/lib/env", () => ({
  env: mockEnv,
}));

describe("LLM Provider", () => {
  beforeEach(() => {
    vi.resetModules();
    mockEnv.LLM_PROVIDER = "claude";
  });

  it("returns claude as default provider", async () => {
    const { getCurrentProvider } = await import("./provider");
    expect(getCurrentProvider()).toBe("claude");
  });

  it.each<LLMProvider>(["claude", "gpt", "gemini", "llama", "deepseek"])(
    "returns %s when LLM_PROVIDER is set to %s",
    async (provider) => {
      mockEnv.LLM_PROVIDER = provider;
      const { getCurrentProvider } = await import("./provider");
      expect(getCurrentProvider()).toBe(provider);
    },
  );

  it("returns all available providers", async () => {
    const { getAvailableProviders } = await import("./provider");
    const providers = getAvailableProviders();
    expect(providers).toEqual(["claude", "gpt", "gemini", "llama", "deepseek"]);
  });

  describe("currentModelSupportsTools", () => {
    it.each<[LLMProvider, boolean]>([
      ["claude", true],
      ["gpt", true],
      ["gemini", true],
      ["llama", true],
      ["deepseek", false],
    ])("returns %s for %s provider", async (provider, expected) => {
      mockEnv.LLM_PROVIDER = provider;
      const { currentModelSupportsTools } = await import("./provider");
      expect(currentModelSupportsTools()).toBe(expected);
    });
  });
});
