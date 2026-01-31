import { FlightList } from "@/components/flight/flight-list";
import type { FlightSearchResult } from "@/lib/types";

interface ChatResponseProps {
  flightResult: FlightSearchResult | null;
  message: string;
}

export function ChatResponse({ flightResult, message }: ChatResponseProps) {
  return (
    <div className="space-y-4">
      {flightResult && (
        <FlightList
          destination={flightResult.destination}
          departureDate={flightResult.departureDate}
          flights={flightResult.flights}
        />
      )}
      <div className="whitespace-pre-wrap">{message}</div>
    </div>
  );
}
