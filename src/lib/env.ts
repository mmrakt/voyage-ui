import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const llmProviders = ["claude", "gpt", "gemini", "llama", "deepseek"] as const;

export const env = createEnv({
  server: {
    OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required"),
    LLM_PROVIDER: z.enum(llmProviders).default("claude"),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    AMADEUS_CLIENT_ID: z.string().min(1, "AMADEUS_CLIENT_ID is required"),
    AMADEUS_CLIENT_SECRET: z
      .string()
      .min(1, "AMADEUS_CLIENT_SECRET is required"),
    AMADEUS_HOSTNAME: z.enum(["test", "production"]).default("test"),
  },
  client: {},
  runtimeEnv: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    LLM_PROVIDER: process.env.LLM_PROVIDER,
    NODE_ENV: process.env.NODE_ENV,
    AMADEUS_CLIENT_ID: process.env.AMADEUS_CLIENT_ID,
    AMADEUS_CLIENT_SECRET: process.env.AMADEUS_CLIENT_SECRET,
    AMADEUS_HOSTNAME: process.env.AMADEUS_HOSTNAME,
  },
});
