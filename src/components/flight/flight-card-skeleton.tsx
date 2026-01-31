import { Skeleton } from "@/components/ui/skeleton";

export function FlightCardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex flex-col items-center">
            <div className="h-px w-16 bg-zinc-300 dark:bg-zinc-600" />
            <Skeleton className="mt-1 h-4 w-16" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
