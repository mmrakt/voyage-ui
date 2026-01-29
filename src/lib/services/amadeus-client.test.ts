import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    AMADEUS_CLIENT_ID: "test-client-id",
    AMADEUS_CLIENT_SECRET: "test-client-secret",
    AMADEUS_HOSTNAME: "test",
  },
}));

import { getAirlineName, getAirportCode } from "./amadeus-client";

describe("getAirportCode", () => {
  it("returns correct code for exact match", () => {
    expect(getAirportCode("東京")).toBe("TYO");
    expect(getAirportCode("大阪")).toBe("OSA");
    expect(getAirportCode("京都")).toBe("KIX");
    expect(getAirportCode("福岡")).toBe("FUK");
    expect(getAirportCode("札幌")).toBe("CTS");
    expect(getAirportCode("沖縄")).toBe("OKA");
  });

  it("returns correct code for partial match", () => {
    expect(getAirportCode("京都に行きたい")).toBe("KIX");
    expect(getAirportCode("大阪へ旅行")).toBe("OSA");
    expect(getAirportCode("沖縄でバカンス")).toBe("OKA");
  });

  it("returns null for unknown destination", () => {
    expect(getAirportCode("アトランタ")).toBeNull();
    expect(getAirportCode("ドバイ")).toBeNull();
  });

  it("returns correct code for overseas destinations", () => {
    expect(getAirportCode("ニューヨーク")).toBe("NYC");
    expect(getAirportCode("ハワイ")).toBe("HNL");
    expect(getAirportCode("ソウル")).toBe("ICN");
    expect(getAirportCode("台北")).toBe("TPE");
    expect(getAirportCode("シンガポール")).toBe("SIN");
  });
});

describe("getAirlineName", () => {
  it("returns Japanese airline names", () => {
    expect(getAirlineName("NH")).toBe("ANA");
    expect(getAirlineName("JL")).toBe("JAL");
    expect(getAirlineName("BC")).toBe("スカイマーク");
    expect(getAirlineName("MM")).toBe("Peach");
    expect(getAirlineName("GK")).toBe("ジェットスター・ジャパン");
  });

  it("returns international airline names", () => {
    expect(getAirlineName("AA")).toBe("アメリカン航空");
    expect(getAirlineName("UA")).toBe("ユナイテッド航空");
    expect(getAirlineName("SQ")).toBe("シンガポール航空");
    expect(getAirlineName("KE")).toBe("大韓航空");
  });

  it("returns carrier code for unknown airlines", () => {
    expect(getAirlineName("XX")).toBe("XX");
    expect(getAirlineName("ZZ")).toBe("ZZ");
  });
});
