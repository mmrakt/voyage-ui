import { getLogger } from "@logtape/logtape";
import type { LLMProvider } from "@/lib/llm/provider";
import type { FlightSearchResult } from "@/lib/types";

const logger = getLogger(["voyage-ui", "llm"]);

interface LLMLogParams {
  provider: LLMProvider;
  supportsTools: boolean;
  input: string;
  response: string;
  toolResult: FlightSearchResult | null;
}

export function logLLMResponse(params: LLMLogParams): void {
  logger.info("LLM Response", {
    provider: params.provider,
    supportsTools: params.supportsTools,
    input: params.input,
    response: params.response,
    toolResult: params.toolResult,
  });
}
