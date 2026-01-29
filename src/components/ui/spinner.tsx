interface SpinnerProps {
  text?: string;
}

export function Spinner({ text = "読み込み中..." }: SpinnerProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
      <span className="text-sm text-zinc-500">{text}</span>
    </div>
  );
}
