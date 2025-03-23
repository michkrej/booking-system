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

const findOverlappingInventoryBookings = (
  items: ReturnType<typeof createItemsObject>,
  inventoryBooking1: Booking & BookableItem,
  inventoryBooking2: Booking & BookableItem,
) => {
  if (inventoryBooking1.key !== inventoryBooking2.key) return;

  const range1 = {
    start: convertToDate(inventoryBooking1.startDate),
    end: convertToDate(inventoryBooking1.endDate),
  };
  const range2 = {
    start: convertToDate(inventoryBooking2.startDate),
    end: convertToDate(inventoryBooking2.endDate),
  };

  if (isTextItem(inventoryBooking1)) {
    const itemStore = items[inventoryBooking1.key];

    itemStore.events.set(inventoryBooking1.id, inventoryBooking1);
  }

  if (isTextItem(inventoryBooking2)) {
    const itemStore = items[inventoryBooking2.key];

    itemStore.events.set(inventoryBooking2.id, inventoryBooking2);
  }

  if (!areIntervalsOverlapping(range1, range2)) return;

  if (isNumericItem(inventoryBooking1) && isNumericItem(inventoryBooking2)) {
    const bookableItemLimits = useBoundStore.getState().bookableItems;

    const itemStore = items[inventoryBooking1.key];

    itemStore.sum += +inventoryBooking1.value + +inventoryBooking2.value;

    // If the sum of the bookable items exceeds the limit, add the bookings to the events
    if (itemStore.sum > bookableItemLimits[inventoryBooking1.key]) {
      itemStore.events.set(inventoryBooking1.id, inventoryBooking1);
      itemStore.events.set(inventoryBooking2.id, inventoryBooking2);
    }
  }
};

export const createInventoryBookings = (events: Booking[]) =>
  events.flatMap((event) =>
    (event?.bookableItems ?? []).map((bookableItem) => ({
      ...event,
      ...bookableItem,
    })),
  );

export const findInventoryCollisionsBetweenEvents = (
  events: Booking[],
): {
  collisions: (Booking & BookableItem)[];
  items: NumericItems & TextItems;
} => {
  const items = createItemsObject();
  const inventoryBookings = createInventoryBookings(events);

  // Group bookings by key to avoid redundant comparisons
  const groupedBookings = new Map<string, (Booking & BookableItem)[]>();
  for (const booking of inventoryBookings) {
    if (!groupedBookings.has(booking.key)) groupedBookings.set(booking.key, []);
    groupedBookings.get(booking.key)!.push(booking);
  }

  for (const bookings of groupedBookings.values()) {
    // Compare all pairs of bookings
    for (let i = 0; i < bookings.length; i++) {
      for (let j = i + 1; j < bookings.length; j++) {
        const booking1 = bookings[i];
        const booking2 = bookings[j];

        if (!booking1 || !booking2) {
          console.warn("Missing booking data:", { booking1, booking2 });
          continue;
        }

        // Skip comparing the item bookings of the same plan
        if (booking1.planId === booking2.planId) continue;

        // Process overlapping inventory bookings
        findOverlappingInventoryBookings(items, booking1, booking2);
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
