import { z } from "zod";

export const searchFlightsParameters = z.object({
  destination: z.string().describe("目的地の都市名"),
});

export type SearchFlightsParams = z.infer<typeof searchFlightsParameters>;

export const searchFlightsTool = {
  description: "指定した目的地へのフライトを検索します",
  parameters: searchFlightsParameters,
};
