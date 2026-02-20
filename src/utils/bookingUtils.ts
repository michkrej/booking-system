import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import { type BookableItem } from "@/interfaces/interfaces";

/**
 * Shifts all bookableItems by the same time delta as the event move.
 *
 * @param originalStartDate - The original event start date
 * @param newStartDate - The new event start date after move
 * @param bookableItems - The array of bookable items to shift
 * @returns New array of bookable items with shifted dates
 */
export function shiftBookableItemTimes(
  originalStartDate: Date,
  newStartDate: Date,
  bookableItems?: BookableItem[]
): BookableItem[] | undefined {
  if (!bookableItems?.length) return bookableItems;

  const deltaMs = differenceInMilliseconds(newStartDate, originalStartDate);
  if (deltaMs === 0) return bookableItems;

  return bookableItems.map((item) => ({
    ...item,
    startDate: addMilliseconds(new Date(item.startDate), deltaMs),
    endDate: addMilliseconds(new Date(item.endDate), deltaMs),
  }));
}
