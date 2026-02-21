import { describe, expect, it } from "vitest";
import { getDateRangeOverLaps } from "./date.utils";

describe("getDateRangeOverLaps", () => {
  it("should return null if the ranges do not overlap", () => {
    const range1: [Date, Date] = [
      new Date("2025-01-01"),
      new Date("2025-01-02"),
    ];
    const range2: [Date, Date] = [
      new Date("2025-01-03"),
      new Date("2025-01-04"),
    ];

    expect(getDateRangeOverLaps(range1, range2)).toBe(null);
  });

  it("range 1 spans whole range 2", () => {
    const range1: [Date, Date] = [
      new Date("2025-01-01"),
      new Date("2025-01-04"),
    ];
    const range2: [Date, Date] = [
      new Date("2025-01-02"),
      new Date("2025-01-03"),
    ];

    expect(getDateRangeOverLaps(range1, range2)).toEqual(range2);
  });

  it("range 1 completely within range 2", () => {
    const range1: [Date, Date] = [
      new Date("2025-01-02"),
      new Date("2025-01-03"),
    ];
    const range2: [Date, Date] = [
      new Date("2025-01-01"),
      new Date("2025-01-04"),
    ];

    expect(getDateRangeOverLaps(range1, range2)).toEqual(range1);
  });

  it("range 1 starts before range 2 and ends within range 2", () => {
    const range1: [Date, Date] = [
      new Date("2025-01-01"),
      new Date("2025-01-03"),
    ];
    const range2: [Date, Date] = [
      new Date("2025-01-02"),
      new Date("2025-01-04"),
    ];

    expect(getDateRangeOverLaps(range1, range2)).toEqual([
      range2[0],
      range1[1],
    ]);
  });

  it("range 1 starts within range 2 and ends after range 2", () => {
    const range1: [Date, Date] = [
      new Date("2025-01-03"),
      new Date("2025-01-05"),
    ];
    const range2: [Date, Date] = [
      new Date("2025-01-01"),
      new Date("2025-01-04"),
    ];

    expect(getDateRangeOverLaps(range1, range2)).toEqual([
      range1[0],
      range2[1],
    ]);
  });
});
