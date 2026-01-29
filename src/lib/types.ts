import type { ReactNode } from "react";

export interface Flight {
  id: string;
  airline: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
}

export interface FlightSearchResult {
  destination: string;
  flights: Flight[];
}

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}
