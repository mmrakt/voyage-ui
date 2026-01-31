import type { Flight } from "@/lib/types";
import { formatISODateDisplay } from "@/lib/utils/iso-date";
import { FlightCard } from "./flight-card";

interface FlightListProps {
  destination: string;
  departureDate: string;
  flights: Flight[];
}

export function FlightList({
  destination,
  departureDate,
  flights,
}: FlightListProps) {
  const displayDate = formatISODateDisplay(departureDate) ?? departureDate;

  if (flights.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-400">
          {displayDate}の{destination}へのフライトが見つかりませんでした。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {destination}へのフライト ({flights.length}件)
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {displayDate}
        </p>
      </div>
      <div className="space-y-2">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  );
}
