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
) => {
  const bookableItemLimits = useBoundStore.getState().bookableItems;

  const range1 = {
    start: inventoryBooking1.startDate,
    end: inventoryBooking1.endDate,
  };
  const range2 = {
    start: inventoryBooking2.startDate,
    end: inventoryBooking2.endDate,
  };

  // if the first booking exceeds the limit, we add it to the events and return
  if (inventoryBooking1.value > bookableItemLimits[inventoryBooking1.key]) {
    items[inventoryBooking1.key].events.set(
      inventoryBooking1.id,
      inventoryBooking1,
    );
  }

  if (inventoryBooking2.value > bookableItemLimits[inventoryBooking2.key]) {
    items[inventoryBooking2.key].events.set(
      inventoryBooking2.id,
      inventoryBooking2,
    );
  }

  if (!areIntervalsOverlapping(range1, range2)) {
    return;
  }

  const itemStore = items[inventoryBooking1.key];

  // get all bookings that are already in the itemStore and pick out those that overlap with the new booking
  const overlappingBookings = Array.from(itemStore.events.values()).filter(
    (booking) => {
      const bookingRange = {
        start: convertToDate(booking.startDate),
        end: convertToDate(booking.endDate),
      };
      return areIntervalsOverlapping(range1, bookingRange);
    },
  );

  // Sum up the values of the overlapping bookings
  const overlappingSum = overlappingBookings.reduce(
    (sum, booking) => sum + +booking.value,
    +inventoryBooking1.value + +inventoryBooking2.value,
  );

  // If the sum of the bookable items exceeds the limit, add the bookings to the events
  if (overlappingSum > bookableItemLimits[inventoryBooking1.key]) {
    itemStore.sum = overlappingSum;
    itemStore.events.set(inventoryBooking1.id, inventoryBooking1);
    itemStore.events.set(inventoryBooking2.id, inventoryBooking2);
  }
};

const findOverlappingInventoryBookings = (
  items: ReturnType<typeof createItemsObject>,
  inventoryBooking1: Booking & BookableItem,
  inventoryBooking2: Booking & BookableItem,
) => {
  if (isTextItem(inventoryBooking1) && isTextItem(inventoryBooking2)) {
    handleTextItemCollisions(items, inventoryBooking1, inventoryBooking2);
    return;
  }

  if (isNumericItem(inventoryBooking1) && isNumericItem(inventoryBooking2)) {
    handleNumericItemCollisions(items, inventoryBooking1, inventoryBooking2);
    return;
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

        // Skip comparing items that are not the same
        if (booking1.key !== booking2.key) continue;

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

  console.log(res);
  console.log(items);

  return {
    collisions: res,
    items: items,
  };
};
