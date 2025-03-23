import { areIntervalsOverlapping } from "date-fns";
import {
  type NumericBookableKeys,
  type TextBookableKeys,
  type BookableItem,
  type NumericBookableItem,
  type TextBookableItem,
  type Booking,
} from "./interfaces";
import { BOOKABLE_ITEM_OPTIONS } from "./CONSTANTS";
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

const isTextItem = (item: BookableItem): item is TextBookableItem => {
  const findItem = BOOKABLE_ITEM_OPTIONS.find(
    (bookableItem) => bookableItem.key === item.key,
  );

  if (findItem?.inputType === "text") {
    return true;
  }

  return false;
};

const isNumericItem = (item: BookableItem): item is NumericBookableItem => {
  const findItem = BOOKABLE_ITEM_OPTIONS.find(
    (bookableItem) => bookableItem.key === item.key,
  );

  if (findItem?.inputType === "number") {
    return true;
  }

  return false;
};

const handleTextItemCollisions = (
  items: ReturnType<typeof createItemsObject>,
  inventoryBooking1: Booking & TextBookableItem,
  inventoryBooking2: Booking & TextBookableItem,
) => {
  const range1 = {
    start: inventoryBooking1.startDate,
    end: inventoryBooking1.endDate,
  };
  const range2 = {
    start: inventoryBooking2.startDate,
    end: inventoryBooking2.endDate,
  };

  if (!areIntervalsOverlapping(range1, range2)) {
    return;
  }

  items[inventoryBooking1.key].events.set(
    inventoryBooking1.id,
    inventoryBooking1,
  );
  items[inventoryBooking2.key].events.set(
    inventoryBooking2.id,
    inventoryBooking2,
  );
};

const handleNumericItemCollisions = (
  items: ReturnType<typeof createItemsObject>,
  inventoryBooking1: Booking & NumericBookableItem,
  inventoryBooking2: Booking & NumericBookableItem,
  bookableItemLimits: Record<NumericBookableKeys, number>,
) => {
  const range1 = {
    start: inventoryBooking1.startDate,
    end: inventoryBooking1.endDate,
  };
  const range2 = {
    start: inventoryBooking2.startDate,
    end: inventoryBooking2.endDate,
  };

  if (!areIntervalsOverlapping(range1, range2)) {
    return;
  }

  const itemStore = items[inventoryBooking1.key];

  // Fetch and filter overlapping bookings in one step
  const overlappingBookings = Array.from(itemStore.events.values()).filter(
    (booking) =>
      areIntervalsOverlapping(
        { start: booking.startDate, end: booking.endDate },
        range1,
      ),
  );

  // Sum up the values of the overlapping bookings
  const overlappingSum = overlappingBookings.reduce(
    (sum, booking) => sum + +booking.value,
    +inventoryBooking1.value + +inventoryBooking2.value,
  );

  if (overlappingSum <= bookableItemLimits[inventoryBooking1.key]) return;

  // If the sum of the bookable items exceeds the limit, add the bookings to the events
  itemStore.sum = overlappingSum;
  itemStore.events.set(inventoryBooking1.id, inventoryBooking1);
  itemStore.events.set(inventoryBooking2.id, inventoryBooking2);
};

const findOverlappingInventoryBookings = (
  items: ReturnType<typeof createItemsObject>,
  inventoryBooking1: Booking & BookableItem,
  inventoryBooking2: Booking & BookableItem,
  bookableItemLimits: Record<NumericBookableKeys, number>,
) => {
  if (isTextItem(inventoryBooking1) && isTextItem(inventoryBooking2)) {
    handleTextItemCollisions(items, inventoryBooking1, inventoryBooking2);
  } else if (
    isNumericItem(inventoryBooking1) &&
    isNumericItem(inventoryBooking2)
  ) {
    handleNumericItemCollisions(
      items,
      inventoryBooking1,
      inventoryBooking2,
      bookableItemLimits,
    );
  }
};

export const createInventoryBookings = (events: Booking[]) =>
  events.flatMap((event) =>
    (event?.bookableItems ?? []).map((bookableItem) => ({
      ...event,
      ...bookableItem,
      startDate: convertToDate(bookableItem.startDate),
      endDate: convertToDate(bookableItem.endDate),
      bookableItems: [bookableItem],
    })),
  );

export const findInventoryCollisionsBetweenEvents = (
  events: Booking[],
): {
  collisions: (Booking & BookableItem)[];
  items: NumericItems & TextItems;
} => {
  const bookableItemLimits = useBoundStore.getState().bookableItems;
  const items = createItemsObject();
  const inventoryBookings = createInventoryBookings(events);

  // Group bookings by key to avoid redundant comparisons
  const groupedBookings = new Map<string, (Booking & BookableItem)[]>();
  for (const booking of inventoryBookings) {
    groupedBookings.set(booking.key, [
      ...(groupedBookings.get(booking.key) ?? []),
      booking,
    ]);
  }

  for (const bookings of groupedBookings.values()) {
    // Compare all pairs of bookings
    for (let i = 0; i < bookings.length; i++) {
      const booking1 = bookings[i];

      if (!booking1) {
        console.warn("Missing booking data:", { booking1 });
        continue;
      }

      if (
        isNumericItem(booking1) &&
        booking1.value > bookableItemLimits[booking1.key]
      ) {
        items[booking1.key].events.set(booking1.id, booking1);
      }

      for (let j = i + 1; j < bookings.length; j++) {
        const booking2 = bookings[j];

        if (!booking2) {
          console.warn("Missing booking data:", { booking2 });
          continue;
        }

        if (
          isNumericItem(booking2) &&
          booking2.value > bookableItemLimits[booking2.key]
        ) {
          items[booking2.key].events.set(booking2.id, booking2);
        }

        // Skip comparing the item bookings of the same plan
        if (booking1.planId === booking2.planId) continue;

        // Skip comparing items that are not the same
        if (booking1.key !== booking2.key) continue;

        // Process overlapping inventory bookings
        findOverlappingInventoryBookings(
          items,
          booking1,
          booking2,
          bookableItemLimits,
        );
      }
    }
  }

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
