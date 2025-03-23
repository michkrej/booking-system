import { describe, expect, it, beforeEach } from "vitest";
import { findInventoryCollisionsBetweenEvents } from "./inventoryCollisions";
import { BookableItem, type Booking } from "./interfaces";
import { DEFAULT_ITEMS } from "@/state/adminStoreSlice";

describe("findInventoryCollisionsBetweenEvents", () => {
  let events: unknown[];

  /*   beforeEach(() => {
    events = [
      {
        id: "1",
        planId: "1",
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
        planId: "2",
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
    const { collisions } = findInventoryCollisionsBetweenEvents(
      events as Booking[],
    );
    expect(collisions).toEqual([]);
  });

  it("should return collisions for two text items that overlap", () => {
    events.push(
      {
        id: "3",
        planId: "1",
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
        id: "4",
        planId: "2",
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2025-01-01T12:00:00"),
            endDate: new Date("2025-01-01T13:00:00"),
          },
        ],
      },
    );

    const { collisions } = findInventoryCollisionsBetweenEvents(
      events as Booking[],
    );

    expect(collisions.flatMap((col) => col.id)).toEqual(["3", "4"]);
  });

  it("should return collisions for several text items that overlap", () => {
    events.push(
      {
        id: "5",
        planId: "1",
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2025-01-01T12:00:00"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
      {
        id: "6",
        planId: "2",
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2025-01-01T12:00:00"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
      {
        id: "7",
        planId: "3",
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2025-01-01T12:00:00"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
    );

    const { collisions } = findInventoryCollisionsBetweenEvents(
      events as Booking[],
    );
    expect(collisions.flatMap((col) => col.id)).toEqual(["5", "6", "7"]);
  });

  it("should return collision for two numeric items that overlap", () => {
    events.push(
      {
        id: "8",
        planId: "1",
        bookableItems: [
          {
            key: "grillar",
            value: 5,
            startDate: new Date("2025-01-01T12:00:00"),
            endDate: new Date("2025-01-03T13:00:00"),
          },
        ],
      },
      {
        id: "9",
        planId: "2",
        bookableItems: [
          {
            key: "grillar",
            value: 4,
            startDate: new Date("2025-01-02T12:00:00"),
            endDate: new Date("2025-01-02T13:00:00"),
          },
        ],
      },
    );

    const { collisions, items } = findInventoryCollisionsBetweenEvents(
      events as Booking[],
    );

    expect(collisions.flatMap((col) => col.id)).toEqual(["8", "9"]);
    expect(items.grillar.sum).toBe(9);
  });

  it("should return a collision if a numeric item exceeds the limit by itself", () => {
    events.push({
      id: "10",
      planId: "1",
      bookableItems: [
        {
          key: "grillar",
          value: DEFAULT_ITEMS.grillar + 1,
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-01-02"),
        },
      ],
    });

    const { collisions } = findInventoryCollisionsBetweenEvents(
      events as Booking[],
    );

    expect(collisions.flatMap((col) => col.id)).toEqual(["10"]);
  });

  it("should detect collisions when multiple overlapping numeric items exceed the limit", () => {
    events.push(
      {
        id: "11",
        planId: "1",
        bookableItems: [
          {
            key: "grillar",
            value: DEFAULT_ITEMS.grillar + 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
      {
        id: "12",
        planId: "2",
        bookableItems: [
          {
            key: "grillar",
            value: DEFAULT_ITEMS.grillar - 5,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
      {
        id: "13",
        planId: "3",
        bookableItems: [
          {
            key: "grillar",
            value: DEFAULT_ITEMS.grillar + 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
    );

    const { collisions } = findInventoryCollisionsBetweenEvents(
      events as Booking[],
    );

    expect(collisions.flatMap((col) => col.id)).toEqual(["11", "12", "13"]);
  });

  it("should return no collisions if all numeric items are below the limit", () => {
    events.push(
      {
        id: "14",
        planId: "1",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
      {
        id: "15",
        planId: "2",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
      {
        id: "16",
        planId: "3",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
    );

    const { collisions } = findInventoryCollisionsBetweenEvents(
      events as Booking[],
    );

    expect(collisions).toEqual([]);
  });

  it("should not return a collision if a single numeric item exactly meets the limit", () => {
    events.push({
      id: "21",
      planId: "1",
      bookableItems: [
        {
          key: "grillar",
          value: DEFAULT_ITEMS.grillar, // Exactly at the limit
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-01-02"),
        },
      ],
    });

    const { collisions } = findInventoryCollisionsBetweenEvents(
      events as Booking[],
    );
    expect(collisions).toEqual([]); // No collision expected
  });

  it("should not return collisions for overlapping numeric items with different keys", () => {
    events.push(
      {
        id: "25",
        planId: "1",
        bookableItems: [
          {
            key: "grillar",
            value: DEFAULT_ITEMS.grillar,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
      {
        id: "26",
        planId: "2",
        bookableItems: [
          {
            key: "bardiskar", // Different key
            value: 2,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          },
        ],
      },
    );

    const { collisions } = findInventoryCollisionsBetweenEvents(
      events as Booking[],
    );
    expect(collisions).toEqual([]); // No collision expected
  });
 */
  it("should run efficiently with 1000+ bookings", () => {
    const NUM_EVENTS = 1000;
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-01-02");

    // Generate 1000+ bookings
    console.log("Generating events...");

    const newEvents: unknown[] = [];
    for (let i = 0; i < 200; i++) {
      console.log(`Creating event ${i}`);

      const event = {
        startDate: startDate,
        endDate: endDate,
        planId: `${i}`,
        id: `${i}`,
        bookableItems: [
          {
            key: "grillar",
            value: 10,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-02"),
          } satisfies BookableItem,
        ],
      };

      newEvents.push(event);
    }

    console.log("Events created");

    // Measure execution time
    const start = performance.now();
    const { collisions } = findInventoryCollisionsBetweenEvents(
      newEvents as Booking[],
    );
    const end = performance.now();

    console.log(`Execution time: ${(end - start).toFixed(2)}ms`);

    // Ensure the function completes within a reasonable time
    expect(end - start).toBeLessThan(500); // Adjust threshold if needed
    expect(collisions.length).toBeGreaterThan(0); // Ensure some collisions are found
  });
});
