declare module "amadeus" {
  interface AmadeusConfig {
    clientId: string;
    clientSecret: string;
    hostname?: "test" | "production";
  }

  interface FlightOffersSearchParams {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    adults: number;
    max?: number;
    currencyCode?: string;
  }

  interface FlightOfferSegment {
    departure: {
      iataCode: string;
      at: string;
    };
    arrival: {
      iataCode: string;
      at: string;
    };
    carrierCode: string;
    operating?: {
      carrierCode: string;
    };
  }

  interface FlightOfferItinerary {
    duration: string;
    segments: FlightOfferSegment[];
  }

  interface FlightOffer {
    id: string;
    price: {
      total: string;
      currency: string;
    };
    itineraries: FlightOfferItinerary[];
    validatingAirlineCodes: string[];
  }

  interface FlightOffersSearchResponse {
    data: FlightOffer[];
  }

  interface FlightOffersSearch {
    get(params: FlightOffersSearchParams): Promise<FlightOffersSearchResponse>;
  }

  interface Shopping {
    flightOffersSearch: FlightOffersSearch;
  }

  class Amadeus {
    constructor(config: AmadeusConfig);
    shopping: Shopping;
  }

  export = Amadeus;
}
