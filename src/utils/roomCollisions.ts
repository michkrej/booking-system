import { areIntervalsOverlapping } from "date-fns";
import { type Booking } from "./interfaces";
import { convertToDate } from "@/lib/utils";

const eventsUseSameRooms = (event1: Booking, event2: Booking) => {
  const set1 = new Set(event1.roomId);
  const set2 = new Set(event2.roomId);

  // Check if there's any intersection between the two sets
  for (const room of set1) {
    if (set2.has(room)) return true;
  }
  return false;
};

const findCollisionBetweenEvents = (
  collidingEvents: Map<string, Booking>,
  event1: Booking,
  event2: Booking,
) => {
  const range1 = {
    start: convertToDate(event1.startDate),
    end: convertToDate(event1.endDate),
  };
  const range2 = {
    start: convertToDate(event2.startDate),
    end: convertToDate(event2.endDate),
  };

  if (areIntervalsOverlapping(range1, range2)) {
    // Check for room or corridor collisions
    if (eventsUseSameRooms(event1, event2)) {
      collidingEvents.set(event1.id, event1);
      collidingEvents.set(event2.id, event2);
    }
  }

  return collidingEvents;
};

export const findRoomCollisionsBetweenEvents = (events: Booking[]) => {
  const collidingEvents = new Map<string, Booking>();

  // Only check each pair once and avoid checking the same event with itself
  for (let i = 0; i < events.length; i++) {
    const event1 = events[i];

    for (let j = i + 1; j < events.length; j++) {
      const event2 = events[j];

      if (!event1 || !event2) continue;

      // Skip comparing the same event with itself or events that are not happening at the same location
      if (
        event1.planId === event2.planId ||
        event1.locationId !== event2.locationId
      ) {
        continue;
      }

      findCollisionBetweenEvents(collidingEvents, event1, event2);
    }
  }

  return Array.from(collidingEvents.values());
};
