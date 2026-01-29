import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    OPENROUTER_API_KEY: "test-key",
    LLM_PROVIDER: "claude",
    USE_MOCK_API: true,
    NODE_ENV: "test",
  },
}));

import { searchFlights } from "./flight-api";

describe("searchFlights", () => {
  it("returns flights for a known destination", async () => {
    const result = await searchFlights("京都");

    expect(result.destination).toBe("京都");
    expect(result.flights).toHaveLength(3);
    expect(result.flights[0]).toHaveProperty("id");
    expect(result.flights[0]).toHaveProperty("airline");
    expect(result.flights[0]).toHaveProperty("price");
    expect(result.flights[0]).toHaveProperty("departureTime");
    expect(result.flights[0]).toHaveProperty("arrivalTime");
    expect(result.flights[0]).toHaveProperty("duration");
  });

  it("returns default flights for an unknown destination", async () => {
    const result = await searchFlights("ニューヨーク");

    expect(result.destination).toBe("ニューヨーク");
    expect(result.flights).toHaveLength(2);
    expect(result.flights[0].id).toContain("DEF");
  });

  it("returns flights for partial destination match", async () => {
    const result = await searchFlights("大阪へ行きたい");

    expect(result.destination).toBe("大阪へ行きたい");
    expect(result.flights).toHaveLength(3);
    expect(result.flights[0].id).toContain("OSA");
  });
});
