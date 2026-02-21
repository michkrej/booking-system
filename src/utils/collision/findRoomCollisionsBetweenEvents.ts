import type { Booking } from "@/interfaces/interfaces";
import {
  type ConvertedEvent,
  convertEvent,
  findCollisionPairs,
} from "./collision.utils";

/**
 * Returns a list of events that overlap with some event in the given list.
 * @param events
 * @returns
 */
export const findRoomCollisionsBetweenEvents = (events: Booking[]) => {
  const convertedEvents = events.map(convertEvent);
  const collisionPairs = findCollisionPairs(convertedEvents, {
    collectRoomIds: false,
  });

  // Extract unique colliding events
  const collidingEvents = new Map<string, ConvertedEvent>();
  for (const pair of collisionPairs) {
    collidingEvents.set(pair.event1.id, pair.event1);
    collidingEvents.set(pair.event2.id, pair.event2);
  }

  return Array.from(collidingEvents.values());
};
