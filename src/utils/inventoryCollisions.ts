import { areIntervalsOverlapping } from "date-fns";
import { useBoundStore } from "@/state/store";
import { convertToDate } from "@/utils/utils";
import {
  type BookableItem,
  type BookableItemNames,
  type Booking,
  type NumericBookableItem,
  type NumericBookableKeys,
  type TextBookableItem,
  type TextBookableKeys,
} from "../interfaces/interfaces";

type NumericItems = Record<
  NumericBookableKeys,
  { events: Map<string, NumericBookableItem & Booking>; sum: number }
>;
type TextItems = Record<
  TextBookableKeys,
  { events: Map<string, TextBookableItem & Booking> }
>;

const createItemsObject = (): NumericItems & TextItems => ({
  grillar: { sum: 0, events: new Map() },
  bardiskar: { sum: 0, events: new Map() },
  "bankset-hg": { sum: 0, events: new Map() },
  "bankset-hoben": { sum: 0, events: new Map() },
  "bankset-k": { sum: 0, events: new Map() },
  ff: { events: new Map() },
  forte: { events: new Map() },
  "other-inventory": { events: new Map() },
});

const handleTextItemCollisions = (
  items: ReturnType<typeof createItemsObject>,
  groupedBookings: Map<BookableItemNames, (Booking & BookableItem)[]>,
) => {
  const textBookings: (Booking & TextBookableItem)[] = [
    ...(groupedBookings.get("ff") ?? []),
    ...(groupedBookings.get("forte") ?? []),
    ...(groupedBookings.get("other-inventory") ?? []),
  ] as (Booking & TextBookableItem)[];

  for (let i = 0; i < textBookings.length; i++) {
    const booking1 = textBookings[i];

    if (!booking1) {
      console.warn("Missing booking data:", { booking1 });
      continue;
    }

    for (let j = i + 1; j < textBookings.length; j++) {
      const booking2 = textBookings[j];

      if (!booking2) {
        console.warn("Missing booking data:", { booking2 });
        continue;
      }

      // Skip comparing the item bookings of the same plan
      if (booking1.planId === booking2.planId) continue;

      // Skip comparing items that are not the same
      if (booking1.key !== booking2.key) continue;

      const range1 = {
        start: booking1.startDate,
        end: booking1.endDate,
      };
      const range2 = {
        start: booking2.startDate,
        end: booking2.endDate,
      };

      if (!areIntervalsOverlapping(range1, range2)) {
        continue;
      }

      items[booking1.key].events.set(booking1.id, booking1);
      items[booking2.key].events.set(booking2.id, booking2);
    }
  }
};

const handleNumericItemCollisions = (
  items: ReturnType<typeof createItemsObject>,
  groupedBookings: Map<BookableItemNames, (Booking & BookableItem)[]>,
) => {
  const bookableItemLimits = useBoundStore.getState().bookableItems;
  const numericBookings = {
    bardiskar: groupedBookings.get("bardiskar") ?? [],
    "bankset-hg": groupedBookings.get("bankset-hg") ?? [],
    "bankset-hoben": groupedBookings.get("bankset-hoben") ?? [],
    "bankset-k": groupedBookings.get("bankset-k") ?? [],
    grillar: groupedBookings.get("grillar") ?? [],
  } as Record<NumericBookableKeys, (Booking & NumericBookableItem)[]>;

  // Sweep line algorithm: detects when ANY combination of overlapping events exceeds limits
  type SweepEvent = {
    time: Date;
    type: "START" | "END";
    bookingId: string;
    planId: string;
    value: number;
    booking: Booking & NumericBookableItem;
  };

  for (const [key, bookings] of Object.entries(numericBookings)) {
    if (bookings.length === 0) continue;

    const limit = bookableItemLimits[key as NumericBookableKeys];

    // Create sweep line events for each booking
    const events: SweepEvent[] = [];
    for (const booking of bookings) {
      if (!booking) {
        console.warn("Missing booking data:", { booking });
        continue;
      }

      events.push({
        time: booking.startDate,
        type: "START",
        bookingId: booking.id,
        planId: booking.planId,
        value: +booking.value,
        booking,
      });
      events.push({
        time: booking.endDate,
        type: "END",
        bookingId: booking.id,
        planId: booking.planId,
        value: +booking.value,
        booking,
      });
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

    // Sweep through events, tracking concurrent usage at each point
    let currentSum = 0;
    let maxSum = 0;
    const activeBookings = new Map<string, Booking & NumericBookableItem>();
    const collidingIds = new Set<string>();

    for (const event of events) {
      if (event.type === "START") {
        currentSum += event.value;
        activeBookings.set(event.bookingId, event.booking);

        // Check for collision after each START event
        if (currentSum > limit) {
          maxSum = Math.max(maxSum, currentSum);
          // Mark all currently active bookings as collisions
          for (const id of activeBookings.keys()) {
            collidingIds.add(id);
          }
        }
      } else {
        currentSum -= event.value;
        activeBookings.delete(event.bookingId);
      }
    }

    // Record results
    const typedKey = key as NumericBookableKeys;
    if (collidingIds.size > 0) {
      items[typedKey].sum = maxSum;
      for (const booking of bookings) {
        if (collidingIds.has(booking.id)) {
          items[typedKey].events.set(booking.id, booking);
        }
      }
    }
  }
};

export const createGroupedInventoryBookings = (events: Booking[]) => {
  const sortedInventoryBookings = events
    .flatMap((event) =>
      (event?.bookableItems ?? []).map((bookableItem) => ({
        ...event,
        ...bookableItem,
        startDate: convertToDate(bookableItem.startDate),
        endDate: convertToDate(bookableItem.endDate),
        bookableItems: [bookableItem],
      })),
    )
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Group bookings by key to avoid redundant comparisons
  const groupedBookings = new Map<
    BookableItemNames,
    (Booking & BookableItem)[]
  >();
  for (const booking of sortedInventoryBookings) {
    const existing = groupedBookings.get(booking.key);
    if (existing) {
      existing.push(booking);
    } else {
      groupedBookings.set(booking.key, [booking]);
    }
  }

  return groupedBookings;
};

export const findInventoryCollisionsBetweenEvents = (
  events: Booking[],
): {
  collisions: (Booking & BookableItem)[];
  items: NumericItems & TextItems;
} => {
  const items = createItemsObject();
  const groupedInventoryBookings = createGroupedInventoryBookings(events);

  handleTextItemCollisions(items, groupedInventoryBookings);
  handleNumericItemCollisions(items, groupedInventoryBookings);

  const collisions = Object.values(items).flatMap((item) => [
    ...item.events.values(),
  ]);

  return {
    collisions,
    items: items,
  };
};
