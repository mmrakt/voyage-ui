import { describe, expect, it } from "vitest";
import { searchFlightsParameters, searchFlightsTool } from "./flight";

describe("searchFlightsTool", () => {
  it("has correct description", () => {
    expect(searchFlightsTool.description).toContain(
      "指定した目的地へのフライトを検索します",
    );
  });

  it("validates destination only", () => {
    const result = searchFlightsParameters.safeParse({
      destination: "京都",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.destination).toBe("京都");
      expect(result.data.departureDate).toBeUndefined();
    }
  });

  it("validates destination with departureDate", () => {
    const result = searchFlightsParameters.safeParse({
      destination: "大阪",
      departureDate: "2024-03-15",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.destination).toBe("大阪");
      expect(result.data.departureDate).toBe("2024-03-15");
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

  it("allows optional departureDate to be undefined", () => {
    const result = searchFlightsParameters.safeParse({
      destination: "福岡",
      departureDate: undefined,
    });

    expect(result.success).toBe(true);
  });
});
