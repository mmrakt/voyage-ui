import { env } from "@/lib/env";
import type { FlightSearchResult } from "@/lib/types";
import { getMockFlights } from "./mock-data";

export async function searchFlights(
  destination: string,
): Promise<FlightSearchResult> {
  if (env.USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      destination,
      flights: getMockFlights(destination),
    };
  }

  throw new Error(
    "Real API not implemented. Set USE_MOCK_API=true to use mock data.",
  );
}
