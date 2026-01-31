import { tool } from "ai";
import { z } from "zod";
import { FlightList } from "@/components/flight/flight-list";
import { FlightListSkeleton } from "@/components/flight/flight-list-skeleton";
import { searchFlights } from "@/lib/services/flight-api";
import type { FlightSearchResult } from "@/lib/types";
import { getTomorrowDate } from "@/lib/utils/date";
import { normalizeISODate } from "@/lib/utils/iso-date";

interface StreamableUI {
  update: (node: React.ReactNode) => void;
}

interface ToolState {
  flightResult: FlightSearchResult | null;
}

export function createSearchFlightsTool(
  uiStream: StreamableUI,
  state: ToolState,
) {
  return tool({
    description:
      "指定した目的地へのフライトを検索します。日付を指定することもできます。",
    inputSchema: z.object({
      destination: z.string().describe("目的地の都市名"),
      departureDate: z
        .string()
        .optional()
        .describe(
          "出発日（YYYY-MM-DD形式）。指定がない場合は翌日。例: 2024-03-15",
        ),
    }),
    execute: async ({ destination, departureDate }) => {
      const normalizedDate = normalizeISODate(departureDate);
      const shouldFallback =
        typeof departureDate === "string" && !normalizedDate;
      const displayDate = shouldFallback ? getTomorrowDate() : normalizedDate;

      uiStream.update(
        <FlightListSkeleton
          destination={destination}
          departureDate={displayDate}
        />,
      );

      const searchResult = await searchFlights({
        destination,
        departureDate: normalizedDate ?? undefined,
      });
      state.flightResult = searchResult;

      uiStream.update(
        <FlightList
          destination={searchResult.destination}
          departureDate={searchResult.departureDate}
          flights={searchResult.flights}
        />,
      );

      return searchResult;
    },
  });
}
