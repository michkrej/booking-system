import type { Booking, Plan } from "@/interfaces/interfaces";
import { convertEvent, findCollisionPairs } from "./collision.utils";

interface BookingWithCollidingRooms extends Booking {
  collidingRooms: string[];
}

type CollisionsPerPlan = Record<
  string,
  [BookingWithCollidingRooms, BookingWithCollidingRooms][]
>;

/**
 * Finds collisions between events in different plans.
 *
 * @param {Plan[]} plans - The plans to check for room collisions.
 * @returns {CollisionsPerPlan}
 * A map where each key is a plan ID and the value is an array of
 * tuples containing the two bookings that collide.
 */
const findRoomCollisionsBetweenPlans = (plans: Plan[]): CollisionsPerPlan => {
  const collidingEvents: CollisionsPerPlan = {};

  if (plans.length === 0) return collidingEvents;

  // Flatten all plan events into a single array
  const allEvents = plans.flatMap((plan) => plan.events.map(convertEvent));

  // Find all collision pairs with room IDs
  const collisionPairs = findCollisionPairs(allEvents, {
    collectRoomIds: true,
  });

  // Group collisions by plan ID (store each collision from both plan perspectives)
  for (const pair of collisionPairs) {
    const { event1, event2, collidingRooms } = pair;

    const event1WithCollidingRooms = {
      ...event1,
      collidingRooms: collidingRooms!,
    };
    const event2WithCollidingRooms = {
      ...event2,
      collidingRooms: collidingRooms!,
    };

    // Add to plan1's collisions
    const plan1Collisions =
      collidingEvents[event1.planId] ?? (collidingEvents[event1.planId] = []);
    plan1Collisions.push([event1WithCollidingRooms, event2WithCollidingRooms]);

    // Add to plan2's collisions
    const plan2Collisions =
      collidingEvents[event2.planId] ?? (collidingEvents[event2.planId] = []);
    plan2Collisions.push([event2WithCollidingRooms, event1WithCollidingRooms]);
  }

  return collidingEvents;
};

export type { BookingWithCollidingRooms, CollisionsPerPlan };
export { findRoomCollisionsBetweenPlans };
