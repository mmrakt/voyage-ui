import { describe, expect, it } from "vitest";
import {
  formatISODateDisplay,
  normalizeISODate,
  parseISODateLocal,
} from "./iso-date";

describe("parseISODateLocal", () => {
  it("parses valid ISO date string", () => {
    const date = parseISODateLocal("2024-03-15");
    expect(date).not.toBeNull();
    expect(date?.getFullYear()).toBe(2024);
    expect(date?.getMonth()).toBe(2);
    expect(date?.getDate()).toBe(15);
  });

  it("returns null for invalid ISO date string", () => {
    expect(parseISODateLocal("2024-02-30")).toBeNull();
    expect(parseISODateLocal("not-a-date")).toBeNull();
  });
});

describe("normalizeISODate", () => {
  it("returns date string when valid", () => {
    expect(normalizeISODate("2024-03-15")).toBe("2024-03-15");
  });

  it("returns undefined for invalid date string", () => {
    expect(normalizeISODate("2024-02-30")).toBeUndefined();
    expect(normalizeISODate("invalid")).toBeUndefined();
  });
});

describe("formatISODateDisplay", () => {
  it("formats date using locale", () => {
    const result = formatISODateDisplay("2024-03-15", "ja-JP");
    expect(result).toMatch(/2024年3月15日/);
  });

  it("returns null for invalid date", () => {
    expect(formatISODateDisplay("2024-02-30")).toBeNull();
  });
});
