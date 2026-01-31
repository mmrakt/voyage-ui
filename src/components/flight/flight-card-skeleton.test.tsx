import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FlightCardSkeleton } from "./flight-card-skeleton";

describe("FlightCardSkeleton", () => {
  it("renders skeleton elements", () => {
    const { container } = render(<FlightCardSkeleton />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("has consistent structure with FlightCard", () => {
    const { container } = render(<FlightCardSkeleton />);
    expect(container.querySelector(".rounded-lg")).toBeInTheDocument();
    expect(container.querySelector(".border")).toBeInTheDocument();
  });
});
