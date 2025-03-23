import { areIntervalsOverlapping } from "date-fns";
import {
  type NumericBookableKeys,
  type TextBookableKeys,
  type BookableItem,
  type NumericBookableItem,
  type TextBookableItem,
  type Booking,
  type BookableItemNames,
} from "./interfaces";
import { useBoundStore } from "@/state/store";
import { convertToDate } from "@/lib/utils";

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

  for (const [, bookings] of Object.entries(numericBookings)) {
    // for each booking, find all the other bookings that overlap with it and then sum up their values
    for (let i = 0; i < bookings.length; i++) {
      const booking1 = bookings[i]!;
      const overlappingBookings = [booking1];

      if (!booking1) {
        console.warn("Missing booking data:", { booking1 });
        continue;
      }

      let sum = +booking1.value;
      for (let j = i + 1; j < bookings.length; j++) {
        const booking2 = bookings[j];

        if (!booking2) {
          console.warn("Missing booking data:", { booking2 });
          continue; // Skip the current booking
        }

        // Skip comparing the item bookings of the same plan
        if (booking1.planId === booking2.planId) continue;
        if (booking1.id === booking2.id) continue;

        const range1 = {
          start: booking1.startDate,
          end: booking1.endDate,
        };
        const range2 = {
          start: booking2.startDate,
          end: booking2.endDate,
        };

        if (areIntervalsOverlapping(range1, range2)) {
          overlappingBookings.push(booking2);
          sum += +booking2.value;
        }
      }

      const key = booking1.key;
      if (sum > bookableItemLimits[key]) {
        items[key].sum = sum;

        for (const booking of overlappingBookings) {
          items[key].events.set(booking.id, booking);
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
    groupedBookings.set(booking.key, [
      ...(groupedBookings.get(booking.key) ?? []),
      booking,
    ]);
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

  // Extract unique events by their 'id' to remove duplicates
  const res = Array.from(
    new Map(
      Object.values(items)
        // @ts-expect-error - Type 'Map<string, NumericBookableItem & Booking>' is not assignable to type 'NumericBookableItem & Booking'
        .flatMap((item) => Array.from(item.events.values()))
        .map((event) => [event.id, event]), // Ensure uniqueness by event id
    ).values(),
  );

  return {
    collisions: res,
    items: items,
  };
};
