import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/lib/env";

export type LLMProvider = "claude" | "gpt" | "gemini" | "llama" | "deepseek";

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

interface ModelConfig {
  modelId: string;
  supportsTools: boolean;
}

const models: Record<LLMProvider, ModelConfig> = {
  claude: {
    modelId: "anthropic/claude-sonnet-4-20250514",
    supportsTools: true,
  },
  gpt: { modelId: "openai/gpt-4o", supportsTools: true },
  gemini: { modelId: "google/gemini-2.0-flash-001", supportsTools: true },
  llama: { modelId: "meta-llama/llama-3.3-70b-instruct", supportsTools: true },
  deepseek: {
    modelId: "tngtech/deepseek-r1t2-chimera:free",
    supportsTools: false,
  },
};

const validProviders = Object.keys(models) as LLMProvider[];

export function getModel() {
  const provider = env.LLM_PROVIDER;
  return openrouter(models[provider].modelId);
}

export function currentModelSupportsTools(): boolean {
  return models[env.LLM_PROVIDER].supportsTools;
}

export function getCurrentProvider(): LLMProvider {
  return env.LLM_PROVIDER;
}

export function getAvailableProviders(): LLMProvider[] {
  return validProviders;
}
