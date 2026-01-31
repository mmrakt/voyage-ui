import { z } from "zod";

export const searchFlightsParameters = z.object({
  destination: z.string().describe("目的地の都市名"),
  departureDate: z
    .string()
    .optional()
    .describe("出発日（YYYY-MM-DD形式）。指定がない場合は翌日。例: 2024-03-15"),
});

export type SearchFlightsParams = z.infer<typeof searchFlightsParameters>;

export const searchFlightsTool = {
  description:
    "指定した目的地へのフライトを検索します。日付を指定することもできます。",
  parameters: searchFlightsParameters,
};
