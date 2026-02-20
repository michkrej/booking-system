import { areIntervalsOverlapping } from "date-fns";
import { convertToDate } from "@/utils/utils";
import { type Booking } from "../interfaces/interfaces";

const eventsUseSameRooms = (event1: Booking, event2: Booking) => {
  const set1 = new Set(event1.roomId);
  const set2 = new Set(event2.roomId);

  // Check if there's any intersection between the two sets
  for (const room of set1) {
    if (set2.has(room)) return true;
  }
  return false;
};

export const findRoomCollisionsBetweenEvents = (events: Booking[]) => {
  const collidingEvents = new Map<string, Booking>();

  const sortedEvents = events
    .map((event) => ({
      ...event,
      startDate: convertToDate(event.startDate),
      endDate: convertToDate(event.endDate),
    }))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Only check each pair once and avoid checking the same event with itself
  for (let i = 0; i < sortedEvents.length; i++) {
    const event1 = sortedEvents[i];

    for (let j = i + 1; j < sortedEvents.length; j++) {
      const event2 = sortedEvents[j];

      if (!event1 || !event2) continue;

      // Skip comparing the same event with itself or events that are not happening at the same location
      if (
        event1.planId === event2.planId ||
        event1.locationId !== event2.locationId
      ) {
        continue;
      }

      const range1 = {
        start: event1.startDate,
        end: event1.endDate,
      };
      const range2 = {
        start: event2.startDate,
        end: event2.endDate,
      };

      if (areIntervalsOverlapping(range1, range2)) {
        // Check for room or corridor collisions
        if (eventsUseSameRooms(event1, event2)) {
          collidingEvents.set(event1.id, event1);
          collidingEvents.set(event2.id, event2);
        }
      } else {
        // Since the array is sorted, we can stop checking further if events don't overlap
        break;
      }
    }
  }

  return Array.from(collidingEvents.values());
};
