import { logger as defaultLogger } from "@/lib/logger";
import type { Flight, FlightSearchResult } from "@/lib/types";
import {
  type AmadeusFlightOffer,
  formatDuration,
  formatTime,
  getAirlineName,
  getAirportCode,
  getAmadeusClient,
  getTomorrowDate,
} from "./amadeus-client";

// 依存性の型定義
export interface FlightSearchDeps {
  getClient: typeof getAmadeusClient;
  getAirportCode: typeof getAirportCode;
  getTomorrowDate: typeof getTomorrowDate;
  logger: {
    warn: (template: TemplateStringsArray, ...values: unknown[]) => void;
    info: (template: TemplateStringsArray, ...values: unknown[]) => void;
    error: (template: TemplateStringsArray, ...values: unknown[]) => void;
  };
}

// デフォルトの依存性
const defaultDeps: FlightSearchDeps = {
  getClient: getAmadeusClient,
  getAirportCode,
  getTomorrowDate,
  logger: defaultLogger,
};

// 純粋関数としてエクスポート（テスト可能）
export function convertAmadeusOfferToFlight(
  offer: AmadeusFlightOffer,
  index: number,
): Flight {
  const firstItinerary = offer.itineraries[0];
  const firstSegment = firstItinerary.segments[0];
  const lastSegment =
    firstItinerary.segments[firstItinerary.segments.length - 1];

  const carrierCode =
    firstSegment.operating?.carrierCode || firstSegment.carrierCode;

  // 価格を日本円に変換（簡易的にUSD→JPYは150倍）
  let priceInJpy = parseFloat(offer.price.total);
  if (offer.price.currency !== "JPY") {
    priceInJpy = Math.round(priceInJpy * 150);
  }

  return {
    id: `${firstSegment.departure.iataCode}-${String(index + 1).padStart(3, "0")}`,
    airline: getAirlineName(carrierCode),
    price: priceInJpy,
    departureTime: formatTime(firstSegment.departure.at),
    arrivalTime: formatTime(lastSegment.arrival.at),
    duration: formatDuration(firstItinerary.duration),
  };
}

// 依存性注入対応のファクトリ関数
export function createSearchFlights(deps: Partial<FlightSearchDeps> = {}) {
  const { getClient, getAirportCode, getTomorrowDate, logger } = {
    ...defaultDeps,
    ...deps,
  };

  return async function searchFlights(
    destination: string,
  ): Promise<FlightSearchResult> {
    const amadeus = getClient();

    const destinationCode = getAirportCode(destination);
    if (!destinationCode) {
      logger.warn`Unknown destination: ${destination}, returning empty result`;
      return {
        destination,
        flights: [],
      };
    }

    const originCode = "TYO"; // 東京発
    const departureDate = getTomorrowDate();

    try {
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate,
        adults: 1,
        max: 5,
        currencyCode: "JPY",
      });

      const offers = response.data as AmadeusFlightOffer[];

      const flights = offers.map((offer, index) =>
        convertAmadeusOfferToFlight(offer, index),
      );

      logger.info`Found ${flights.length} flights to ${destination} (${destinationCode})`;

      return {
        destination,
        flights,
      };
    } catch (error) {
      logger.error`Failed to search flights: ${error}`;
      throw new Error(
        `フライト検索に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
      );
    }
  };
}

// デフォルトエクスポート（既存コードとの互換性維持）
export const searchFlights = createSearchFlights();
