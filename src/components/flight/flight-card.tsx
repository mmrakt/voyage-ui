import type { Flight } from "@/lib/types";

interface FlightCardProps {
  flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {flight.airline}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {flight.id}
          </span>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ¥{flight.price.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {flight.departureTime}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">出発</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-px w-16 bg-zinc-300 dark:bg-zinc-600" />
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {flight.duration}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {flight.arrivalTime}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">到着</div>
          </div>
        </div>
      </div>
    </div>
  );
}
