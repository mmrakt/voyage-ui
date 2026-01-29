import type { Flight } from "@/lib/types";
import { FlightCard } from "./flight-card";

interface FlightListProps {
  destination: string;
  flights: Flight[];
}

export function FlightList({ destination, flights }: FlightListProps) {
  if (flights.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-400">
          {destination}へのフライトが見つかりませんでした。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {destination}へのフライト ({flights.length}件)
      </h3>
      <div className="space-y-2">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  );
}
