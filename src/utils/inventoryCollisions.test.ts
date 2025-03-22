import { describe, expect, it } from "vitest";
import {
  createInventoryBookings,
  findInventoryCollisions,
} from "./inventoryCollisions";
import { type Booking } from "./interfaces";

describe("findInventoryCollisions", () => {
  it("should return an empty array if there are no collisions", () => {
    const events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "bardiskar",
            value: 1,
            startDate: new Date(),
            endDate: new Date(),
          },
        ],
      },
      {
        id: "2",
        bookableItems: [
          {
            key: "bardiskar",
            value: 1,
            startDate: new Date(),
            endDate: new Date(),
          },
        ],
      },
    ] as Booking[];

    const collisions = findInventoryCollisions(events);

    expect(collisions).toEqual([]);
  });

  it("should return an array of collisions", () => {
    const events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
          },
        ],
      },
      {
        id: "2",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
          },
        ],
      },
      {
        id: "3",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
          },
        ],
      },
    ] as Booking[];

    const collisions = findInventoryCollisions(events);

    const inventoryBookings = createInventoryBookings(events);

    expect(collisions).toEqual(inventoryBookings);
  });

  it("should return an array of collisions with multiple items", () => {
    const events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
          },
          {
            key: "bardiskar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
          },
        ],
      },
      {
        id: "2",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
          },
          {
            key: "bardiskar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
          },
        ],
      },
      {
        id: "3",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
          },
          {
            key: "bardiskar",
            value: 1,
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
          },
        ],
      },
    ] as Booking[];

    const collisions = findInventoryCollisions(events);

    expect(collisions.flatMap((col) => col.id)).toEqual(
      events.flatMap((col) => col.id),
    );
  });

  it("returns collisions for text items", () => {
    const events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
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
            endDate: new Date(),
          },
        ],
      },
      {
        id: "3",
        bookableItems: [
          {
            key: "ff",
            value: "Elverk",
            startDate: new Date("2025-01-01"),
            endDate: new Date(),
          },
        ],
      },
    ] as Booking[];

    const collisions = findInventoryCollisions(events);

    expect(collisions.flatMap((col) => col.id)).toEqual(
      events.flatMap((col) => col.id),
    );
  });

  it("returns collisions for partially overlapping events", () => {
    const events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
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
            value: 1,
            startDate: new Date("2025-01-02"),
            endDate: new Date("2025-01-04"),
          },
        ],
      },
    ] as Booking[];
    const collisions = findInventoryCollisions(events);

    expect(collisions.flatMap((col) => col.id)).toEqual(
      events.flatMap((col) => col.id),
    );
  });

  it("handles numeric items summing correctly", () => {
    const events = [
      {
        id: "1",
        bookableItems: [
          {
            key: "grillar",
            value: 1,
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
            value: 2, // Different value
            startDate: new Date("2025-01-02"),
            endDate: new Date("2025-01-04"),
          },
        ],
      },
    ] as Booking[];

    const collisions = findInventoryCollisions(events);
    expect(collisions.length).toBeGreaterThan(0);
  });

  it("does not return false positives for same item type without overlap", () => {
    const events = [
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

    const collisions = findInventoryCollisions(events);
    expect(collisions).toEqual([]);
  });

  it("detects overlap when only times differ on the same day", () => {
    const events = [
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
            value: 1,
            startDate: new Date("2025-01-01T11:00:00"), // Overlaps
            endDate: new Date("2025-01-01T13:00:00"),
          },
        ],
      },
    ] as Booking[];

    const collisions = findInventoryCollisions(events);
    expect(collisions.flatMap((col) => col.id)).toEqual(["1", "2"]);
  });

  it("returns empty when only one event exists", () => {
    const events = [
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

    const collisions = findInventoryCollisions(events);
    expect(collisions).toEqual([]);
  });

  it("handles a large number of events efficiently", () => {
    const events = Array.from({ length: 1000 }, (_, i) => ({
      id: `${i + 1}`,
      bookableItems: [
        {
          key: "grillar",
          value: 1,
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-01-02"),
        },
      ],
    })) as Booking[];

    const collisions = findInventoryCollisions(events);

    expect(collisions.length).toBeGreaterThan(0);
  });
});
