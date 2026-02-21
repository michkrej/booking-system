import { areIntervalsOverlapping } from "date-fns";
import type {
  BookableItem,
  BookableItemNames,
  Booking,
  NumericBookableItem,
  NumericBookableKeys,
  Plan,
  TextBookableItem,
  TextBookableKeys,
} from "@/interfaces/interfaces";
import { convertToDate } from "@/utils/utils";

interface CollidingItem {
  key: BookableItemNames;
  value: string | number;
  startDate: Date;
  endDate: Date;
}

interface BookingWithCollidingItems extends Booking {
  collidingItems: CollidingItem[];
}

type InventoryCollisionsPerPlan = Record<
  string,
  [BookingWithCollidingItems, BookingWithCollidingItems][]
>;

type InventoryBooking = Booking & BookableItem & { originalBooking: Booking };

/**
 * Converts plan events to inventory bookings, expanding each bookable item
 * into a separate entry while preserving the original booking reference.
 */
const flattenInventoryBookings = (plans: Plan[]): InventoryBooking[] => {
  return plans.flatMap((plan) =>
    plan.events.flatMap((event) =>
      (event?.bookableItems ?? []).map((bookableItem) => ({
        ...event,
        ...bookableItem,
        startDate: convertToDate(bookableItem.startDate),
        endDate: convertToDate(bookableItem.endDate),
        bookableItems: [
          {
            ...bookableItem,
            startDate: convertToDate(bookableItem.startDate),
            endDate: convertToDate(bookableItem.endDate),
          },
        ],
        originalBooking: event,
      })),
    ),
  );
};

/**
 * Groups inventory bookings by their key for efficient collision detection.
 */
const groupByKey = (
  bookings: InventoryBooking[],
): Map<BookableItemNames, InventoryBooking[]> => {
  const grouped = new Map<BookableItemNames, InventoryBooking[]>();

  for (const booking of bookings) {
    const existing = grouped.get(booking.key);
    if (existing) {
      existing.push(booking);
    } else {
      grouped.set(booking.key, [booking]);
    }
  }

  return grouped;
};

interface CollisionPair {
  booking1: InventoryBooking;
  booking2: InventoryBooking;
  collidingItem: CollidingItem;
}

/**
 * Finds text item collisions (same key + time overlap + different plans).
 */
const findTextItemCollisionPairs = (
  groupedBookings: Map<BookableItemNames, InventoryBooking[]>,
): CollisionPair[] => {
  const pairs: CollisionPair[] = [];
  const textKeys: TextBookableKeys[] = ["ff", "forte", "other-inventory"];

  for (const key of textKeys) {
    const bookings = groupedBookings.get(key) ?? [];

    for (let i = 0; i < bookings.length; i++) {
      const booking1 = bookings[i];
      if (!booking1) continue;

      for (let j = i + 1; j < bookings.length; j++) {
        const booking2 = bookings[j];
        if (!booking2) continue;

        // Skip same plan
        if (booking1.planId === booking2.planId) continue;

        const range1 = { start: booking1.startDate, end: booking1.endDate };
        const range2 = { start: booking2.startDate, end: booking2.endDate };

        if (!areIntervalsOverlapping(range1, range2)) continue;

        // Calculate the overlapping time range
        const overlapStart =
          booking1.startDate > booking2.startDate
            ? booking1.startDate
            : booking2.startDate;
        const overlapEnd =
          booking1.endDate < booking2.endDate
            ? booking1.endDate
            : booking2.endDate;

        pairs.push({
          booking1,
          booking2,
          collidingItem: {
            key: key as BookableItemNames,
            value: (booking1 as unknown as TextBookableItem).value,
            startDate: convertToDate(overlapStart),
            endDate: convertToDate(overlapEnd),
          },
        });
      }
    }
  }

  return pairs;
};

/**
 * Finds numeric item collisions using sweep line algorithm.
 * Returns pairs when the sum of concurrent bookings exceeds the limit.
 */
const findNumericItemCollisionPairs = (
  groupedBookings: Map<BookableItemNames, InventoryBooking[]>,
  bookableItemLimits: Record<NumericBookableKeys, number>,
): CollisionPair[] => {
  const pairs: CollisionPair[] = [];
  const numericKeys: NumericBookableKeys[] = [
    "bardiskar",
    "bankset-hg",
    "bankset-hoben",
    "bankset-k",
    "grillar",
  ];

  type SweepEvent = {
    time: Date;
    type: "START" | "END";
    booking: InventoryBooking;
    value: number;
  };

  for (const key of numericKeys) {
    const bookings = groupedBookings.get(key) ?? [];
    if (bookings.length === 0) continue;

    const limit = bookableItemLimits[key];

    // Create sweep line events
    const events: SweepEvent[] = [];
    for (const booking of bookings) {
      const value = +(booking as unknown as NumericBookableItem).value;
      events.push({ time: booking.startDate, type: "START", booking, value });
      events.push({ time: booking.endDate, type: "END", booking, value });
    }

    // Sort: by time, then END before START (adjacent intervals don't collide)
    events.sort((a, b) => {
      const timeDiff = a.time.getTime() - b.time.getTime();
      if (timeDiff !== 0) return timeDiff;
      if (a.type !== b.type) {
        return a.type === "END" ? -1 : 1;
      }
      return 0;
    });

    // Track unique collision pairs to avoid duplicates
    const seenPairs = new Set<string>();
    let currentSum = 0;
    const activeBookings = new Map<string, InventoryBooking>();

    for (const event of events) {
      if (event.type === "START") {
        const newBooking = event.booking;

        // When limit is exceeded, only pair the NEW booking with existing active bookings
        // This avoids O(n^2) per event, making total complexity O(n^2) instead of O(n^3)
        if (currentSum + event.value > limit) {
          for (const existingBooking of activeBookings.values()) {
            // Skip same plan
            if (newBooking.planId === existingBooking.planId) continue;

            // Create canonical pair key
            const pairKey = [newBooking.id, existingBooking.id]
              .sort()
              .join("-");
            if (seenPairs.has(pairKey)) continue;
            seenPairs.add(pairKey);

            // Calculate overlap time
            const overlapStart =
              newBooking.startDate > existingBooking.startDate
                ? newBooking.startDate
                : existingBooking.startDate;
            const overlapEnd =
              newBooking.endDate < existingBooking.endDate
                ? newBooking.endDate
                : existingBooking.endDate;

            pairs.push({
              booking1: newBooking,
              booking2: existingBooking,
              collidingItem: {
                key: key as BookableItemNames,
                value: (newBooking as unknown as NumericBookableItem).value,
                startDate: convertToDate(overlapStart),
                endDate: convertToDate(overlapEnd),
              },
            });
          }
        }

        currentSum += event.value;
        activeBookings.set(event.booking.id, event.booking);
      } else {
        currentSum -= event.value;
        activeBookings.delete(event.booking.id);
      }
    }
  }

  return pairs;
};

/**
 * Finds inventory collisions between events in different plans.
 *
 * @param {Plan[]} plans - The plans to check for inventory collisions.
 * @returns {InventoryCollisionsPerPlan}
 * A map where each key is a plan ID and the value is an array of
 * tuples containing the two bookings that collide, with their colliding items.
 */
const findInventoryCollisionsBetweenPlans = (
  plans: Plan[],
  bookableItemLimits: Record<NumericBookableKeys, number>,
): InventoryCollisionsPerPlan => {
  const collidingEvents: InventoryCollisionsPerPlan = {};

  if (plans.length === 0) return collidingEvents;

  // Flatten all plan events into inventory bookings
  const allInventoryBookings = flattenInventoryBookings(plans);
  if (allInventoryBookings.length === 0) return collidingEvents;

  // Group by item key for efficient comparison
  const groupedBookings = groupByKey(allInventoryBookings);

  // Find collision pairs for text and numeric items
  const textPairs = findTextItemCollisionPairs(groupedBookings);
  const numericPairs = findNumericItemCollisionPairs(
    groupedBookings,
    bookableItemLimits,
  );
  const allPairs = [...textPairs, ...numericPairs];

  // Group collisions by plan ID (dual-storage pattern)
  for (const pair of allPairs) {
    const { booking1, booking2, collidingItem } = pair;

    // Use original booking for the collision entry, add colliding items
    const booking1WithItems: BookingWithCollidingItems = {
      ...booking1.originalBooking,
      startDate: convertToDate(booking1.originalBooking.startDate),
      endDate: convertToDate(booking1.originalBooking.endDate),
      collidingItems: [collidingItem],
    };
    const booking2WithItems: BookingWithCollidingItems = {
      ...booking2.originalBooking,
      startDate: convertToDate(booking2.originalBooking.startDate),
      endDate: convertToDate(booking2.originalBooking.endDate),
      collidingItems: [collidingItem],
    };

    // Add to plan1's collisions
    const plan1Collisions =
      collidingEvents[booking1.planId] ??
      (collidingEvents[booking1.planId] = []);
    plan1Collisions.push([booking1WithItems, booking2WithItems]);

    // Add to plan2's collisions
    const plan2Collisions =
      collidingEvents[booking2.planId] ??
      (collidingEvents[booking2.planId] = []);
    plan2Collisions.push([booking2WithItems, booking1WithItems]);
  }

  return collidingEvents;
};

export type {
  BookingWithCollidingItems,
  CollidingItem,
  InventoryCollisionsPerPlan,
};
export { findInventoryCollisionsBetweenPlans };
