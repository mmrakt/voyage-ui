import { Skeleton } from "@/components/ui/skeleton";
import { formatISODateDisplay } from "@/lib/utils/iso-date";
import { FlightCardSkeleton } from "./flight-card-skeleton";

interface FlightListSkeletonProps {
  destination: string;
  departureDate?: string;
  count?: number;
}

export function FlightListSkeleton({
  destination,
  departureDate,
  count = 5,
}: FlightListSkeletonProps) {
  const displayDate = departureDate
    ? (formatISODateDisplay(departureDate) ?? departureDate)
    : null;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {destination}へのフライトを検索中...
        </h3>
        {displayDate ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {displayDate}
          </p>
        ) : (
          <Skeleton className="mt-1 h-4 w-32" />
        )}
      </div>
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items never reorder
          <FlightCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
