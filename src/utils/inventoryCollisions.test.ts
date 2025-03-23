import { describe, expect, it, beforeEach } from "vitest";
import { findInventoryCollisionsBetweenEvents } from "./inventoryCollisions";
import { type Booking } from "./interfaces";

describe("findInventoryCollisionsBetweenEvents", () => {
  let events: Booking[];

  beforeEach(() => {
    events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "bardiskar",
            value: 1,
            startDate: new Date("2025-01-01T00:00:00"),
            endDate: new Date("2025-01-02T23:59:59"),
          },
        ],
      },
      {
        id: "2",
        bookableItems: [
          {
            key: "bardiskar",
            value: 1,
            startDate: new Date("2025-01-03T00:00:00"),
            endDate: new Date("2025-01-04T23:59:59"),
          },
        ],
      },
    ] as Booking[];
  });

  it("should return an empty array if there are no collisions", () => {
    const { collisions } = findInventoryCollisionsBetweenEvents(events);
    expect(collisions).toEqual([]);
  });

  it("returns collisions for text items", () => {
    events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
      {
        id: "2",
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
    ] as Booking[];

    const { collisions } = findInventoryCollisionsBetweenEvents(events);
    expect(collisions.flatMap((col) => col.id)).toEqual(["1", "2"]);
  });

  it("returns collision when numeric items summing exceeds limit and they overlap", () => {
    events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "grillar",
            value: 2, // First booking
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-03"),
          },
        ],
      },
      {
        id: "2",
        bookableItems: [
          {
            key: "grillar",
            value: 10, // Second booking (sum exceeds limit)
            startDate: new Date("2025-01-02"),
            endDate: new Date("2025-01-04"),
          },
        ],
      },
    ] as Booking[];

    const { collisions, items } = findInventoryCollisionsBetweenEvents(events);
    expect(collisions.length).toBeGreaterThan(0);
    expect(items.grillar.sum).toBe(12);
  });

  it("does not return false positives for non-overlapping items", () => {
    events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "bardiskar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
      {
        id: "2",
        bookableItems: [
          {
            key: "bardiskar",
            value: 1,
            startDate: new Date("2025-01-03"), // No overlap
            endDate: new Date("2025-01-04"),
          },
        ],
      },
    ] as Booking[];

    const { collisions } = findInventoryCollisionsBetweenEvents(events);
    expect(collisions).toEqual([]);
  });

  it("detects overlap when only times differ on the same day", () => {
    events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01T10:00:00"),
            endDate: new Date("2025-01-01T12:00:00"),
          },
        ],
      },
      {
        id: "2",
        bookableItems: [
          {
            key: "grillar",
            value: 10,
            startDate: new Date("2025-01-01T11:00:00"), // Overlaps
            endDate: new Date("2025-01-01T13:00:00"),
          },
        ],
      },
    ] as Booking[];

    const res = findInventoryCollisionsBetweenEvents(events);
    expect(res.collisions.flatMap((col) => col.id)).toEqual(["1", "2"]);
  });

  it("returns empty when only one event exists", () => {
    events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
    ] as Booking[];

    const { collisions } = findInventoryCollisionsBetweenEvents(events);
    expect(collisions).toEqual([]);
  });

  it("handles a large number of events efficiently", () => {
    events = Array.from({ length: 1000 }, (_, i) => ({
      id: `${i + 1}`,
      bookableItems: [
        {
          key: "grillar",
          value: 1,
          startDate: new Date(
            `2025-01-${String((i % 30) + 1).padStart(2, "0")}`,
          ), // Vary dates
          endDate: new Date(`2025-01-${String((i % 30) + 2).padStart(2, "0")}`),
        },
      ],
    })) as Booking[];

    const { collisions } = findInventoryCollisionsBetweenEvents(events);
    expect(collisions.length).toBeGreaterThan(0);
  });
});
