import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Flight } from "@/lib/types";
import { FlightCard } from "./flight-card";

describe("FlightCard", () => {
  const mockFlight: Flight = {
    id: "TEST-001",
    airline: "Test Airlines",
    price: 25000,
    departureTime: "10:00",
    arrivalTime: "12:00",
    duration: "2時間",
  };

  it("renders flight information correctly", () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.getByText("Test Airlines")).toBeInTheDocument();
    expect(screen.getByText("TEST-001")).toBeInTheDocument();
    expect(screen.getByText("¥25,000")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
    expect(screen.getByText("12:00")).toBeInTheDocument();
    expect(screen.getByText("2時間")).toBeInTheDocument();
  });
});
