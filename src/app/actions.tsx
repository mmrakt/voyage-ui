"use server";

import { createStreamableUI, getMutableAIState } from "@ai-sdk/rsc";
import { stepCountIs, streamText } from "ai";
import { ChatResponse } from "@/components/chat/chat-response";
import { Spinner } from "@/components/ui/spinner";
import {
  currentModelSupportsTools,
  getCurrentProvider,
  getModel,
} from "@/lib/llm/provider";
import { logLLMResponse } from "@/lib/logger";
import { setupLogger } from "@/lib/logger/config";
import { getSystemPrompt } from "@/lib/prompts/system";
import { createSearchFlightsTool } from "@/lib/tools/search-flights";
import type { FlightSearchResult } from "@/lib/types";
import type { AI, UIState } from "./ai";

export async function continueConversation(input: string): Promise<UIState> {
  await setupLogger();

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    messages: [...aiState.get().messages, { role: "user", content: input }],
  });

  const uiStream = createStreamableUI(<Spinner />);
  const state: { flightResult: FlightSearchResult | null } = {
    flightResult: null,
  };
  const supportsTools = currentModelSupportsTools();

  (async () => {
    const result = streamText({
      model: getModel(),
      system: getSystemPrompt(supportsTools),
      messages: aiState.get().messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      tools: supportsTools
        ? { searchFlights: createSearchFlightsTool(uiStream, state) }
        : undefined,
      stopWhen: stepCountIs(3),
    });

    let message = "";
    for await (const chunk of result.textStream) {
      message += chunk;
      uiStream.update(
        <ChatResponse flightResult={state.flightResult} message={message} />,
      );
    }

    const finalText = await result.text;

    logLLMResponse({
      provider: getCurrentProvider(),
      supportsTools,
      input,
      response: finalText,
      toolResult: state.flightResult,
    });

    aiState.done({
      messages: [
        ...aiState.get().messages,
        { role: "assistant", content: finalText },
      ],
    });

    uiStream.done(
      <ChatResponse flightResult={state.flightResult} message={finalText} />,
    );
  })();

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    display: uiStream.value,
  };
}
