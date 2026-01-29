import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LLMProvider } from "./provider";

let mockProvider: LLMProvider = "claude";

vi.mock("@/lib/env", () => ({
  env: {
    get OPENROUTER_API_KEY() {
      return "test-key";
    },
    get LLM_PROVIDER() {
      return mockProvider;
    },
    get NODE_ENV() {
      return "test";
    },
    get AMADEUS_CLIENT_ID() {
      return "test-client-id";
    },
    get AMADEUS_CLIENT_SECRET() {
      return "test-client-secret";
    },
    get AMADEUS_HOSTNAME() {
      return "test";
    },
  },
}));

describe("LLM Provider", () => {
  beforeEach(() => {
    vi.resetModules();
    mockProvider = "claude";
  });

  it("returns claude as default provider", async () => {
    const { getCurrentProvider } = await import("./provider");
    expect(getCurrentProvider()).toBe("claude");
  });

  it.each<LLMProvider>(["claude", "gpt", "gemini", "llama", "deepseek"])(
    "returns %s when LLM_PROVIDER is set to %s",
    async (provider) => {
      mockProvider = provider;
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
      mockProvider = provider;
      const { currentModelSupportsTools } = await import("./provider");
      expect(currentModelSupportsTools()).toBe(expected);
    });
  });
});
