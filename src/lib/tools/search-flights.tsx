import { tool } from "ai";
import { z } from "zod";
import { FlightList } from "@/components/flight/flight-list";
import { Spinner } from "@/components/ui/spinner";
import { searchFlights } from "@/lib/services/flight-api";
import type { FlightSearchResult } from "@/lib/types";

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
    description: "指定した目的地へのフライトを検索します",
    inputSchema: z.object({
      destination: z.string().describe("目的地の都市名"),
    }),
    execute: async ({ destination }) => {
      uiStream.update(
        <Spinner text={`${destination}へのフライトを検索中...`} />,
      );

      const searchResult = await searchFlights(destination);
      state.flightResult = searchResult;

      uiStream.update(
        <FlightList
          destination={searchResult.destination}
          flights={searchResult.flights}
        />,
      );

      return searchResult;
    },
  });
}
