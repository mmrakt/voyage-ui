import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatResponse } from "./chat-response";

describe("ChatResponse", () => {
  it("renders message without flight result", () => {
    render(<ChatResponse flightResult={null} message="Hello, world!" />);
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });

  it("renders message with flight result", () => {
    const flightResult = {
      destination: "京都",
      departureDate: "2024-03-15",
      flights: [
        {
          id: "1",
          airline: "ANA",
          price: 15000,
          departureTime: "10:00",
          arrivalTime: "11:30",
          duration: "1時間30分",
        },
      ],
    };

    render(
      <ChatResponse flightResult={flightResult} message="フライト情報です" />,
    );

    expect(screen.getByText("フライト情報です")).toBeInTheDocument();
    expect(screen.getByText(/京都/)).toBeInTheDocument();
    expect(screen.getByText("ANA")).toBeInTheDocument();
  });
});
