import { isSameDay } from "date-fns";
import { locationMap, roomMap } from "@/data/locationsData";
import { type Booking, type Plan } from "@/interfaces/interfaces";
import { getCommittee } from "@/utils/utils";
import {
  type BookingWithCollidingRooms,
  type CollisionsPerPlan,
  findRoomCollisionsBetweenPlans,
} from "./collision/findRoomCollisionsBetweenPlans";
import { formatDate, getDateRangeOverLaps } from "./date.utils";

interface CollisionSummary {
  total: number;
  location: number;
  inventory: number;
  publicPlansCount: number;
}

interface CollisionDisplayRow {
  id: string;
  plan1: Plan;
  plan2: Plan;
  type: "room" | "inventory";
  detail: string;
  bookings: BookingWithCollidingRooms[];
  startDate: Date;
}

interface CollisionsByKar {
  Consensus: number;
  LinTek: number;
  StuFF: number;
  Övrigt: number;
}

interface NumCollisionsPerPlanId {
  [planId: string]: {
    room: number;
    inventory: number;
    summary: number;
  };
}

const computeCollisionsV2 = (
  plans: Plan[],
): {
  summary: CollisionSummary;
  conflictsByPlanId: NumCollisionsPerPlanId;
  collisionsByKar: CollisionsByKar;
  spectatorDisplayRows: CollisionDisplayRow[];
  collisionInstances: CollisionsPerPlan;
} => {
  if (plans.length === 0) {
    return {
      summary: {
        total: 0,
        location: 0,
        inventory: 0,
        publicPlansCount: 0,
      },
      conflictsByPlanId: {} as NumCollisionsPerPlanId,
      collisionsByKar: { Consensus: 0, LinTek: 0, StuFF: 0, Övrigt: 0 },
      spectatorDisplayRows: [] as CollisionDisplayRow[],
      collisionInstances: {} as CollisionsPerPlan,
    };
  }

  // Find all room collisions
  const roomCollisions = findRoomCollisionsBetweenPlans(plans);
  const inventoryCollisions = {};

  const numLocationCollisions = getNumCollisions(roomCollisions);
  const numInventoryCollisions = getNumCollisions(inventoryCollisions);

  const numConflictsPerPlanId = getNumConflictsPerPlanId(
    roomCollisions,
    inventoryCollisions,
  );

  return {
    summary: {
      total: numLocationCollisions + numInventoryCollisions,
      location: numLocationCollisions,
      inventory: numInventoryCollisions,
      publicPlansCount: plans.length,
    },
    conflictsByPlanId: numConflictsPerPlanId,
    collisionsByKar: getSumConflictsByKar(plans, numConflictsPerPlanId),
    spectatorDisplayRows: getSpectatordDisplayRows(plans, roomCollisions),
    collisionInstances: roomCollisions,
  };
};

const getNumCollisions = (collisions: Record<string, [Booking, Booking][]>) => {
  return Object.values(collisions).flatMap((x) => x).length / 2; // since we save collision per plan we will have the same collision twice -> divide by 2
};

const getNumConflictsPerPlanId = (
  roomCollisions: Record<string, [Booking, Booking][]>,
  inventoryCollisions: Record<string, [Booking, Booking][]>,
) => {
  const numConflictsPerPlanId = Object.entries(roomCollisions).reduce(
    (acc, [planId, collisions]) => {
      acc[planId] = {
        room: collisions.length,
        inventory: 0,
        summary: collisions.length,
      };
      return acc;
    },
    {} as NumCollisionsPerPlanId,
  );

  Object.entries(inventoryCollisions).forEach(([planId, collisions]) => {
    if (planId in numConflictsPerPlanId) {
      numConflictsPerPlanId[planId]!.inventory = collisions.length;
      numConflictsPerPlanId[planId]!.summary += collisions.length;
    } else {
      numConflictsPerPlanId[planId] = {
        room: 0,
        inventory: collisions.length,
        summary: collisions.length,
      };
    }
  });

  return numConflictsPerPlanId;
};

const getSpectatordDisplayRows = (
  plans: Plan[],
  planCollisions: CollisionsPerPlan,
): CollisionDisplayRow[] => {
  const displayRows: CollisionDisplayRow[] = [];

  /*
   *  Decision: should a collision be displayed for both plans or only one?
   *  - Show only for one
   */

  for (const [planId, collisions] of Object.entries(planCollisions)) {
    const plan1Details = plans.find((p) => p.id === planId);
    if (!plan1Details) continue;

    for (const [booking1, booking2] of collisions) {
      if (
        displayRows.some((row) => row.id === `${booking2.id}-${booking1.id}`) ||
        displayRows.some((row) => row.id === `${booking1.id}-${booking2.id}`)
      )
        continue;

      const plan2Details = plans.find((p) => p.id === booking2.planId);
      if (!plan2Details) continue;

      const overlappingTimes = getDateRangeOverLaps(
        [booking1.startDate, booking1.endDate],
        [booking2.startDate, booking2.endDate],
      );
      if (!overlappingTimes) {
        // we should never end up here
        throw new Error(
          `There is no time overlap between ${booking1.id} and ${booking2.id}`,
        );
      }

      const [startDate, endDate] = overlappingTimes;
      const startDateStr = formatDate(startDate, "full");
      const endDateStr = formatDate(
        endDate,
        isSameDay(startDate, endDate) ? "short" : "full",
      );

      const location = locationMap[booking1.locationId];
      const rooms = booking1.collidingRooms.map(
        (roomId) => roomMap[roomId]?.name ?? "Okänt rum",
      );
      const detail = `${location?.name || "Okänd plats"}, ${rooms.join(", ")}, ${startDateStr}–${endDateStr}`;

      displayRows.push({
        id: `${booking1.id}-${booking2.id}`,
        plan1: plan1Details,
        plan2: plan2Details,
        type: "room" as const, // TODO - must handle inventory also
        bookings: [booking1, booking2],
        startDate: overlappingTimes[0],
        detail,
      });
    }
  }

  return displayRows;
};

const getUserConflictsDisplayRows = (
  userPlan: Plan,
  otherPlans: Plan[],
  collisions: [BookingWithCollidingRooms, BookingWithCollidingRooms][],
): CollisionDisplayRow[] => {
  const displayRows: CollisionDisplayRow[] = [];

  /*
   *  Decision: should a collision be displayed for both plans or only one?
   *  - Show only for both
   */

  for (const [booking1, booking2] of collisions) {
    /* if (
        displayRows.some((row) => row.id === `${booking2.id}-${booking1.id}`) ||
        displayRows.some((row) => row.id === `${booking1.id}-${booking2.id}`)
      )
        continue; */

    const plan2Details = otherPlans.find((p) => p.id === booking2.planId);
    if (!plan2Details) continue;

    const overlappingTimes = getDateRangeOverLaps(
      [booking1.startDate, booking1.endDate],
      [booking2.startDate, booking2.endDate],
    );
    if (!overlappingTimes) {
      // we should never end up here
      throw new Error(
        `There is no time overlap between ${booking1.id} and ${booking2.id}`,
      );
    }

    const [startDate, endDate] = overlappingTimes;
    const startDateStr = formatDate(startDate, "full");
    const endDateStr = formatDate(
      endDate,
      isSameDay(startDate, endDate) ? "short" : "full",
    );

    const location = locationMap[booking1.locationId];
    const rooms = booking1.collidingRooms.map(
      (roomId) => roomMap[roomId]?.name ?? "Okänt rum",
    );
    const detail = `${location?.name || "Okänd plats"}, ${rooms.join(", ")}, ${startDateStr}–${endDateStr}`;

    displayRows.push({
      id: `${booking1.id}-${booking2.id}`,
      plan1: userPlan,
      plan2: plan2Details,
      type: "room" as const, // TODO - must handle inventory also
      bookings: [booking1, booking2],
      startDate,
      detail,
    });
  }

  return displayRows;
};

/**
 * Sums up the number of collisions by kår for a given set of plans and collisions.
 */
const getSumConflictsByKar = (
  plans: Plan[],
  numCollisionsByPlan: NumCollisionsPerPlanId,
): CollisionsByKar => {
  const collisionsByKar: CollisionsByKar = {
    Consensus: 0,
    LinTek: 0,
    StuFF: 0,
    Övrigt: 0,
  };

  for (const id of Object.keys(numCollisionsByPlan)) {
    const planDetails = plans.find((p) => p.id === id);
    if (!planDetails) continue;

    const committee = getCommittee(planDetails.committeeId);
    if (!committee) continue;

    const numCollisions = numCollisionsByPlan[id] ?? { room: 0, inventory: 0 };

    // Increment for each kår involved in the collision
    if (committee.kår in collisionsByKar) {
      collisionsByKar[committee.kår] +=
        numCollisions.room + numCollisions.inventory;
    }
  }

  return collisionsByKar;
};

export type {
  CollisionSummary,
  CollisionDisplayRow,
  CollisionsByKar,
  NumCollisionsPerPlanId,
};
export { computeCollisionsV2, getUserConflictsDisplayRows };
