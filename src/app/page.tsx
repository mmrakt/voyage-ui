"use client";

import { useActions, useUIState } from "@ai-sdk/rsc";
import { useState } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageList } from "@/components/chat/message-list";
import type { AI } from "./ai";

export default function Home() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { continueConversation } = useActions<typeof AI>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: string) => {
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        display: <span>{input}</span>,
      },
    ]);

    const response = await continueConversation(input);

    setMessages((prev) => [...prev, response]);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Voyage UI
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          AIがあなたの旅行計画をサポートします
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col p-4">
        <div className="flex-1 overflow-y-auto pb-4">
          <MessageList messages={messages} />
        </div>

        <div className="sticky bottom-0 border-t border-zinc-200 bg-zinc-50 pt-4 dark:border-zinc-700 dark:bg-zinc-900">
          <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
}
