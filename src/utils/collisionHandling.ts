import { areIntervalsOverlapping } from "date-fns";

import roomsC, { corridorsC } from "../data/campusValla/rooms/C.js";
import { locations } from "../data/locationsData.js";
import { type Plan, type Booking } from "./interfaces.js";

export const LOCATION_ID = locations.campusValla["C-huset"].id;
export const CORRIDOR_IDS: string[] = Object.values(corridorsC).map(
  (corridor) => corridor.id,
);
const MAX_ITEMS = {
  grillar: 8,
  bardiskar: 6,
  "bankset-hg": 20,
  "bankset-k": 25,
  trailer: 1,
  tents: 4,
  scene: 10,
  elverk: 1,
} as const;

type ItemName = keyof typeof MAX_ITEMS;

type SummedItems = Record<ItemName, { sum: number; events: Booking[] }>;

/**
 * Creates an items object based on the given event.
 *
 * @param {object} event - The event object.
 * @returns {object} - The items object containing information about the event items.
 */
export const createItemsObject = (event: Booking): SummedItems => {
  const eventItemExists = (item: ItemName) => event[item] !== undefined;
  return (Object.keys(MAX_ITEMS) as ItemName[]).reduce((items, item) => {
    if (typeof event[item] === "boolean") {
      items[item] = {
        sum: 1,
        events: eventItemExists(item) ? [event] : [],
      };
      return items;
    }
    items[item] = {
      sum: event[item] ?? 0,
      events: eventItemExists(item) ? [event] : [],
    };
    return items;
  }, {} as SummedItems);
};

/**
 * Increases the usage of items based on the given event.
 *
 * @param {object} items - The items object to update.
 * @param {object} event - The event object containing the updated item values.
 */
export const increaseItemsUse = (items: SummedItems, event: Booking) => {
  (Object.keys(items) as ItemName[]).forEach((item) => {
    if (event?.[item]) {
      if (typeof event[item] === "boolean") {
        items[item].sum += 1;
      } else {
        items[item].sum += event[item];
      }
      items[item].events.push(event);
    }
  });
};

// TODO: return all items that are over the limit
/**
 * Returns the events with too many items based on the given items object.
 *
 * @param {object} items - The items object.
 * @returns {Array|undefined} - An array of events with too many items, or undefined if no events have too many items.
 */
export const getEventsWithTooManyItems = (items: SummedItems) => {
  for (const item in items) {
    if (items[item as ItemName].sum > MAX_ITEMS[item as ItemName]) {
      return items[item as ItemName].events;
    }
  }
  return undefined;
};

/**
 * Checks if there is a collision between a room and a corridor in the given events.
 *
 * @param {object} event1 - The first event object.
 * @param {object} event2 - The second event object.
 * @returns {boolean} - Returns true if there is a collision between a room and a corridor, otherwise false.
 */
export const isCollisionBetweenRoomAndCorridor = (
  event1: Booking,
  event2: Booking,
) => {
  if (event1.locationId !== LOCATION_ID || event2.locationId !== LOCATION_ID) {
    return false;
  }

  const getBookedRooms = (event: Booking) =>
    roomsC.filter((room) => event.roomId.includes(room.id));
  const getBookedCorridors = (event: Booking) =>
    event.roomId.filter((id) => CORRIDOR_IDS.includes(id));

  return (
    getBookedRooms(event1).some((room) =>
      getBookedCorridors(event2).includes(room.corridorId ?? ""),
    ) ||
    getBookedRooms(event2).some((room) =>
      getBookedCorridors(event1).includes(room.corridorId ?? ""),
    )
  );
};

/**
 * Checks if the given events are in the same corridor.
 *
 * @param {object} event1 - The first event object.
 * @param {object} event2 - The second event object.
 * @returns {boolean} - Returns true if the events are in the same corridor and there is a collision between a room and a corridor, otherwise false.
 */
export const eventsInSameCorridor = (event1: Booking, event2: Booking) => {
  return event1.locationId === event2.locationId
    ? isCollisionBetweenRoomAndCorridor(event1, event2)
    : false;
};

/**
 * Checks if the given events use the same rooms.
 *
 * @param {object} event1 - The first event object.
 * @param {object} event2 - The second event object.
 * @returns {boolean} - Returns true if the events use at least one common room, otherwise false.
 */
export const eventsUseSameRooms = (event1: Booking, event2: Booking) =>
  event1.roomId.some((room) => event2.roomId.includes(room));

/**
 * Finds collisions between two events and returns the set of colliding events.
 *
 * @param {object} event1 - The first event object.
 * @param {object} event2 - The second event object.
 * @param {object} items - The items object.
 * @returns {Set} - A Set containing the colliding events.
 */
export const findCollisionBetweenEvents = (
  event1: Booking,
  event2: Booking,
  items: SummedItems,
) => {
  const collidingEvents = new Set<Booking>();

  const range1 = { start: event1.startDate, end: event1.endDate };
  const range2 = { start: event2.startDate, end: event2.endDate };

  if (areIntervalsOverlapping(range1, range2)) {
    // Check for item collisions
    increaseItemsUse(items, event2);
    const tooManyItems = getEventsWithTooManyItems(items);
    if (tooManyItems) {
      tooManyItems.forEach((itemEvent) => collidingEvents.add(itemEvent));
    }

    // Check for room or corridor collisions
    if (
      eventsUseSameRooms(event1, event2) ||
      eventsInSameCorridor(event1, event2)
    ) {
      collidingEvents.add(event1);
      collidingEvents.add(event2);
    }
  }

  return collidingEvents;
};

/**
 * Finds collisions between a user's plan and public plans and returns an array of colliding events.
 *
 * @param {Array} events - An array of event objects.
 * @param {string} userPlanId - The ID of the user's plan.
 * @returns {Array} - An array of colliding events.
 */
export const findCollisionsBetweenUserPlanAndPublicPlans = (
  userPlan: Plan,
  publicPlans: Plan[],
): Booking[] => {
  const collidingEventIds = new Set<string>();
  const uniqueCollisions: Booking[] = [];

  const userEvents = userPlan.events;
  const publicEvents = publicPlans.flatMap((plan) => plan.events);

  // check for collisions between personal and public events
  userEvents.forEach((userEvent) => {
    const items = createItemsObject(userEvent);

    publicEvents.forEach((publicEvent) => {
      const collisions = findCollisionBetweenEvents(
        userEvent,
        publicEvent,
        items,
      );

      collisions.forEach((event) => {
        if (!collidingEventIds.has(event.id)) {
          // Assuming `event.id` exists
          collidingEventIds.add(event.id);
          uniqueCollisions.push(event);
        }
      });
    });
  });

  return uniqueCollisions;
};

export const findCollisionsBetweenPlans = (
  userPlan: Plan,
  publicPlan: Plan,
) => {
  return findCollisionsBetweenUserPlanAndPublicPlans(userPlan, [publicPlan]);
};
