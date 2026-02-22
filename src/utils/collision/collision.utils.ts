import { areIntervalsOverlapping, interval } from "date-fns";
import type { Booking } from "@/interfaces/interfaces";
import { convertToDate } from "../utils";

function eventsUseSameRooms(
  set1: Set<string>,
  set2: Set<string>,
  collectRoomIds: false,
): boolean;

function eventsUseSameRooms(
  set1: Set<string>,
  set2: Set<string>,
  collectRoomIds: true,
): string[];

function eventsUseSameRooms(
  set1: Set<string>,
  set2: Set<string>,
  collectRoomIds: boolean,
): boolean | string[] {
  const [smaller, larger] =
    set1.size <= set2.size ? [set1, set2] : [set2, set1];

  if (!collectRoomIds) {
    for (const room of smaller) {
      if (larger.has(room)) return true;
    }
    return false;
  }

  const commonRooms = new Set<string>();
  for (const room of smaller) {
    if (larger.has(room)) {
      commonRooms.add(room);
    }
  }

  return Array.from(commonRooms);
}

const convertEvent = (event: Booking) => {
  return {
    ...event,
    startDate: convertToDate(event.startDate),
    endDate: convertToDate(event.endDate),
    roomIdSet: new Set(event.roomId),
  };
};

type ConvertedEvent = Booking & {
  startDate: Date;
  endDate: Date;
  roomIdSet: Set<string>;
};

interface CollisionOptions {
  /** When true, collect and return the specific colliding room IDs.
   *  When false, use fast boolean check (early exit on first match). */
  collectRoomIds?: boolean;
}

interface CollisionPair {
  event1: ConvertedEvent;
  event2: ConvertedEvent;
  collidingRooms: string[] | null;
}

/**
 * Core collision detection function. Finds all pairs of events that collide.
 * Events must already be converted (with Date objects and roomIdSet).
 */
const findCollisionPairs = (
  events: ConvertedEvent[],
  options: CollisionOptions = {},
): CollisionPair[] => {
  const { collectRoomIds = false } = options;
  const collisionPairs: CollisionPair[] = [];

  const byLocation = new Map<string, ConvertedEvent[]>();
  for (const event of events) {
    const group = byLocation.get(event.locationId);
    if (group) {
      group.push(event);
    } else {
      byLocation.set(event.locationId, [event]);
    }
  }

  for (const locationEvents of byLocation.values()) {
    if (locationEvents.length < 2) continue;

    const sortedEvents = locationEvents.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );

    for (let i = 0; i < sortedEvents.length; i++) {
      const event1 = sortedEvents[i];

      for (let j = i + 1; j < sortedEvents.length; j++) {
        const event2 = sortedEvents[j];

        if (!event1 || !event2) continue;

        if (event1.planId === event2.planId) {
          continue;
        }

        const range1 = interval(event1.startDate, event1.endDate);
        const range2 = interval(event2.startDate, event2.endDate);

        if (areIntervalsOverlapping(range1, range2)) {
          if (collectRoomIds) {
            const collidingRooms = eventsUseSameRooms(
              event1.roomIdSet,
              event2.roomIdSet,
              true,
            );
            if (collidingRooms.length > 0) {
              collisionPairs.push({ event1, event2, collidingRooms });
            }
          } else {
            if (eventsUseSameRooms(event1.roomIdSet, event2.roomIdSet, false)) {
              collisionPairs.push({ event1, event2, collidingRooms: null });
            }
          }
        } else {
          // Since the array is sorted, we can stop checking further if events don't overlap
          break;
        }
      }
    }
  }

  return collisionPairs;
};

export type { ConvertedEvent, CollisionOptions, CollisionPair };
export { eventsUseSameRooms, convertEvent, findCollisionPairs };
