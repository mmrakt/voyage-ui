"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { z } from "zod";

const schema = z.object({
  message: z.string().min(1, "メッセージを入力してください"),
});

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled = false }: ChatInputProps) {
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: "onSubmit",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    onSubmit(event, { submission }) {
      event.preventDefault();

      if (submission?.status !== "success" || disabled) {
        return;
      }

      onSubmit(submission.value.message);
      form.reset();
    },
  });

  return (
    <form {...getFormProps(form)} className="flex gap-2">
      <input
        {...getInputProps(fields.message, { type: "text" })}
        placeholder="メッセージを入力してください..."
        disabled={disabled}
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-900"
      >
        送信
      </button>
    </form>
  );
}
