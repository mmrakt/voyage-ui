import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import { formatDuration, formatTime, getTomorrowDate } from "./date";

describe("getTomorrowDate", () => {
  it("returns tomorrow's date in YYYY-MM-DD format", () => {
    const result = getTomorrowDate();
    const expected = dayjs().add(1, "day").format("YYYY-MM-DD");
    expect(result).toBe(expected);
  });

  it("returns a valid date string", () => {
    const result = getTomorrowDate();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("formatTime", () => {
  it("formats ISO datetime to HH:mm", () => {
    expect(formatTime("2024-01-15T14:30:00")).toBe("14:30");
    expect(formatTime("2024-01-15T08:05:00")).toBe("08:05");
    expect(formatTime("2024-01-15T00:00:00")).toBe("00:00");
    expect(formatTime("2024-01-15T23:59:00")).toBe("23:59");
  });

  it("handles timezone correctly", () => {
    expect(formatTime("2024-01-15T09:00:00+09:00")).toBe("09:00");
  });
});

describe("formatDuration", () => {
  it("formats hours and minutes", () => {
    expect(formatDuration("PT2H30M")).toBe("2時間30分");
    expect(formatDuration("PT1H15M")).toBe("1時間15分");
  });

  it("formats hours only", () => {
    expect(formatDuration("PT2H")).toBe("2時間");
    expect(formatDuration("PT10H")).toBe("10時間");
  });

  it("formats minutes only", () => {
    expect(formatDuration("PT45M")).toBe("45分");
    expect(formatDuration("PT5M")).toBe("5分");
  });

  it("returns original string for invalid format", () => {
    expect(formatDuration("invalid")).toBe("invalid");
    expect(formatDuration("2h30m")).toBe("2h30m");
  });
});
