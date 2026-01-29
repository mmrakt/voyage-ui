import { describe, expect, it } from "vitest";
import { searchFlightsParameters, searchFlightsTool } from "./flight";

describe("searchFlightsTool", () => {
  it("has correct description", () => {
    expect(searchFlightsTool.description).toBe(
      "指定した目的地へのフライトを検索します",
    );
  });

  it("validates valid destination parameter", () => {
    const result = searchFlightsParameters.safeParse({
      destination: "京都",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.destination).toBe("京都");
    }
  });

  it("rejects missing destination parameter", () => {
    const result = searchFlightsParameters.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects invalid destination type", () => {
    const result = searchFlightsParameters.safeParse({
      destination: 123,
    });

    expect(result.success).toBe(false);
  });
});
