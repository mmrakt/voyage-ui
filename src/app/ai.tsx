import { createAI } from "@ai-sdk/rsc";
import type { ReactNode } from "react";
import type { ServerMessage } from "@/lib/types";
import { continueConversation } from "./actions";

export interface AIState {
  messages: ServerMessage[];
}

export interface UIState {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export type AIActions = {
  continueConversation: typeof continueConversation;
};

export const AI = createAI<AIState, UIState[], AIActions>({
  actions: {
    continueConversation,
  },
  initialAIState: {
    messages: [],
  },
  initialUIState: [],
});
