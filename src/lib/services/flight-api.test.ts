import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AmadeusFlightOffer } from "./amadeus-client";
import {
  convertAmadeusOfferToFlight,
  createSearchFlights,
  type FlightSearchDeps,
} from "./flight-api";

// モックAmadeusクライアント
function createMockAmadeusClient(mockGet: ReturnType<typeof vi.fn>) {
  return () => ({
    shopping: {
      flightOffersSearch: {
        get: mockGet,
      },
    },
  });
}

// モックロガー
function createMockLogger() {
  return {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  };
}

// テスト用のAmadeusレスポンス生成
function createMockFlightOffer(
  overrides: Partial<AmadeusFlightOffer> = {},
): AmadeusFlightOffer {
  return {
    id: "1",
    price: { total: "15000", currency: "JPY" },
    itineraries: [
      {
        duration: "PT1H15M",
        segments: [
          {
            departure: { iataCode: "HND", at: "2024-01-15T08:00:00" },
            arrival: { iataCode: "KIX", at: "2024-01-15T09:15:00" },
            carrierCode: "NH",
          },
        ],
      },
    ],
    validatingAirlineCodes: ["NH"],
    ...overrides,
  };
}

describe("convertAmadeusOfferToFlight", () => {
  it("converts Amadeus offer to Flight", () => {
    const offer = createMockFlightOffer();

    const result = convertAmadeusOfferToFlight(offer, 0);

    expect(result.id).toBe("HND-001");
    expect(result.airline).toBe("ANA");
    expect(result.price).toBe(15000);
    expect(result.departureTime).toBe("08:00");
    expect(result.arrivalTime).toBe("09:15");
    expect(result.duration).toBe("1時間15分");
  });

  it("converts USD price to JPY", () => {
    const offer = createMockFlightOffer({
      price: { total: "100", currency: "USD" },
    });

    const result = convertAmadeusOfferToFlight(offer, 0);

    expect(result.price).toBe(15000); // 100 * 150
  });

  it("uses operating carrier code when available", () => {
    const offer = createMockFlightOffer({
      itineraries: [
        {
          duration: "PT1H30M",
          segments: [
            {
              departure: { iataCode: "HND", at: "2024-01-15T14:00:00" },
              arrival: { iataCode: "CTS", at: "2024-01-15T15:30:00" },
              carrierCode: "NH",
              operating: { carrierCode: "HD" },
            },
          ],
        },
      ],
    });

    const result = convertAmadeusOfferToFlight(offer, 0);

    expect(result.airline).toBe("エア・ドゥ");
  });

  it("generates correct ID with index", () => {
    const offer = createMockFlightOffer();

    expect(convertAmadeusOfferToFlight(offer, 0).id).toBe("HND-001");
    expect(convertAmadeusOfferToFlight(offer, 1).id).toBe("HND-002");
    expect(convertAmadeusOfferToFlight(offer, 99).id).toBe("HND-100");
  });
});

describe("createSearchFlights", () => {
  let mockGet: ReturnType<typeof vi.fn>;
  let mockLogger: ReturnType<typeof createMockLogger>;
  let deps: FlightSearchDeps;

  beforeEach(() => {
    mockGet = vi.fn();
    mockLogger = createMockLogger();
    deps = {
      getClient: createMockAmadeusClient(
        mockGet,
      ) as FlightSearchDeps["getClient"],
      getAirportCode: (city: string) => {
        const codes: Record<string, string> = {
          京都: "KIX",
          大阪: "OSA",
          福岡: "FUK",
          札幌: "CTS",
        };
        for (const [name, code] of Object.entries(codes)) {
          if (city.includes(name)) return code;
        }
        return null;
      },
      getTomorrowDate: () => "2024-01-15",
      logger: mockLogger,
    };
  });

  it("returns flights from Amadeus API", async () => {
    mockGet.mockResolvedValueOnce({
      data: [createMockFlightOffer()],
    });

    const searchFlights = createSearchFlights(deps);
    const result = await searchFlights("京都");

    expect(result.destination).toBe("京都");
    expect(result.flights).toHaveLength(1);
    expect(result.flights[0].airline).toBe("ANA");
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it("returns empty flights for unknown destination", async () => {
    const searchFlights = createSearchFlights(deps);
    const result = await searchFlights("アトランタ");

    expect(result.destination).toBe("アトランタ");
    expect(result.flights).toHaveLength(0);
    expect(mockGet).not.toHaveBeenCalled();
    expect(mockLogger.warn).toHaveBeenCalled();
  });

  it("throws error when API fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("API Error"));

    const searchFlights = createSearchFlights(deps);

    await expect(searchFlights("大阪")).rejects.toThrow(
      "フライト検索に失敗しました: API Error",
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it("calls API with correct parameters", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const searchFlights = createSearchFlights(deps);
    await searchFlights("福岡");

    expect(mockGet).toHaveBeenCalledWith({
      originLocationCode: "TYO",
      destinationLocationCode: "FUK",
      departureDate: "2024-01-15",
      adults: 1,
      max: 5,
      currencyCode: "JPY",
    });
  });

  it("maps multiple offers correctly", async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        createMockFlightOffer({ id: "1" }),
        createMockFlightOffer({ id: "2" }),
        createMockFlightOffer({ id: "3" }),
      ],
    });

    const searchFlights = createSearchFlights(deps);
    const result = await searchFlights("札幌");

    expect(result.flights).toHaveLength(3);
    expect(result.flights[0].id).toBe("HND-001");
    expect(result.flights[1].id).toBe("HND-002");
    expect(result.flights[2].id).toBe("HND-003");
  });
});
