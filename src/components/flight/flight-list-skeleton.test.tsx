import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FlightListSkeleton } from "./flight-list-skeleton";

describe("FlightListSkeleton", () => {
  it("renders with destination", () => {
    render(<FlightListSkeleton destination="京都" />);
    expect(screen.getByText("京都へのフライトを検索中...")).toBeInTheDocument();
  });

  it("renders formatted departure date", () => {
    render(
      <FlightListSkeleton destination="京都" departureDate="2024-03-15" />,
    );
    expect(screen.getByText(/2024年3月15日/)).toBeInTheDocument();
  });

  it("renders default 5 skeleton cards", () => {
    const { container } = render(<FlightListSkeleton destination="京都" />);
    const cards = container.querySelectorAll(".rounded-lg.border");
    expect(cards.length).toBe(5);
  });

  it("renders custom number of skeleton cards", () => {
    const { container } = render(
      <FlightListSkeleton destination="京都" count={3} />,
    );
    const cards = container.querySelectorAll(".rounded-lg.border");
    expect(cards.length).toBe(3);
  });
});
