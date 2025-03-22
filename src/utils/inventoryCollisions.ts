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

type NumericItems = Record<
  NumericBookableKeys,
  { events: Set<NumericBookableItem & Booking>; sum: number }
>;
type TextItems = Record<
  TextBookableKeys,
  { events: Set<TextBookableItem & Booking> }
>;

const createItemsObject = (): NumericItems & TextItems => {
  return {
    grillar: {
      sum: 0,
      events: new Set(),
    },
    bardiskar: {
      sum: 0,
      events: new Set(),
    },
    "bankset-hg": {
      sum: 0,
      events: new Set(),
    },
    "bankset-hoben": {
      sum: 0,
      events: new Set(),
    },
    "bankset-k": {
      sum: 0,
      events: new Set(),
    },
    ff: {
      events: new Set(),
    },
    forte: {
      events: new Set(),
    },
    "other-inventory": {
      events: new Set(),
    },
  };
};

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

const findOverlappingInventoryBookings = ({
  items,
  inventoryBooking1,
  inventoryBooking2,
}: {
  items: ReturnType<typeof createItemsObject>;
  inventoryBooking1: Booking & BookableItem;
  inventoryBooking2: Booking & BookableItem;
}) => {
  // If the items are not of the same type, we don't need to check for overlap
  if (inventoryBooking1.key !== inventoryBooking2.key) return;

  const range1 = {
    start: inventoryBooking1.startDate,
    end: inventoryBooking1.endDate,
  };
  const range2 = {
    start: inventoryBooking2.startDate,
    end: inventoryBooking2.endDate,
  };

  if (areIntervalsOverlapping(range1, range2)) {
    if (isTextItem(inventoryBooking1) && isTextItem(inventoryBooking2)) {
      items[inventoryBooking1.key].events.add(inventoryBooking1);
      items[inventoryBooking1.key].events.add(inventoryBooking2);
    } else if (
      isNumericItem(inventoryBooking1) &&
      isNumericItem(inventoryBooking2)
    ) {
      items[inventoryBooking1.key].sum +=
        +inventoryBooking1.value + +inventoryBooking2.value;

      items[inventoryBooking1.key].events.add(inventoryBooking1);
      items[inventoryBooking1.key].events.add(inventoryBooking2);
    }
  }
};

export const createInventoryBookings = (events: Booking[]) => {
  return events.flatMap((event) => {
    return event.bookableItems.flatMap((bookableItem) => {
      return {
        ...event,
        ...bookableItem,
      };
    });
  });
};

export const findInventoryCollisions = (
  events: Booking[],
): (Booking & BookableItem)[] => {
  const items = createItemsObject();

  // each inventory item needs to be turned into a "event"

  const inventoryBookings = createInventoryBookings(events);

  // Loop through all the events
  for (const event of inventoryBookings) {
    for (const event2 of inventoryBookings) {
      if (event.id === event2.id) continue;

      findOverlappingInventoryBookings({
        items,
        inventoryBooking1: event,
        inventoryBooking2: event2,
      });
    }
  }

  // we have ensured that each item entry has no duplicates
  // now we want to ensure that we have no duplicates overall

  const res = Object.values(items).flatMap((item) => [...item.events]);

  // removes duplicates
  const noDuplicates = Array.from(
    new Map(res.map((event) => [event.id, event])).values(),
  );

  return noDuplicates;
};
