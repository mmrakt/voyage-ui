import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const llmProviders = ["claude", "gpt", "gemini", "llama", "deepseek"] as const;

export const env = createEnv({
  server: {
    OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required"),
    LLM_PROVIDER: z.enum(llmProviders).default("claude"),
    USE_MOCK_API: z
      .enum(["true", "false"])
      .default("true")
      .transform((val) => val === "true"),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  client: {},
  runtimeEnv: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    LLM_PROVIDER: process.env.LLM_PROVIDER,
    USE_MOCK_API: process.env.USE_MOCK_API,
    NODE_ENV: process.env.NODE_ENV,
  },
});
