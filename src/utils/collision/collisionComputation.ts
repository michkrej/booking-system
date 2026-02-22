import { isSameDay } from "date-fns";
import { locationMap, roomMap } from "@/data/locationsData";
import {
  type Booking,
  type NumericBookableKeys,
  type Plan,
} from "@/interfaces/interfaces";
import { getCommittee } from "@/utils/utils";
import { BOOKABLE_ITEM_OPTIONS } from "../constants";
import { formatDate, getDateRangeOverLaps } from "../date.utils";
import {
  type BookingWithCollidingItems,
  type InventoryCollisionsPerPlan,
  findInventoryCollisionsBetweenPlans,
} from "./findInventoryCollisionsBetweenPlans";
import {
  type BookingWithCollidingRooms,
  type CollisionsPerPlan,
  findRoomCollisionsBetweenPlans,
} from "./findRoomCollisionsBetweenPlans";

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
  bookings: CollisionInstance;
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

type CollisionInstance =
  | [BookingWithCollidingRooms, BookingWithCollidingRooms]
  | [BookingWithCollidingItems, BookingWithCollidingItems];

type CollisionInstancesPerPlan = Record<string, CollisionInstance[]>;

const computeCollisionsV2 = (
  planMap: Record<string, Plan>,
  bookableItems: Record<NumericBookableKeys, number>,
): {
  summary: CollisionSummary;
  collisionsByPlanId: NumCollisionsPerPlanId;
  collisionsByKar: CollisionsByKar;
  spectatorDisplayRows: CollisionDisplayRow[];
  collisionInstances: CollisionInstancesPerPlan;
} => {
  const plansList = Object.values(planMap);
  if (plansList.length === 0) {
    return {
      summary: {
        total: 0,
        location: 0,
        inventory: 0,
        publicPlansCount: 0,
      },
      collisionsByPlanId: {} as NumCollisionsPerPlanId,
      collisionsByKar: { Consensus: 0, LinTek: 0, StuFF: 0, Övrigt: 0 },
      spectatorDisplayRows: [] as CollisionDisplayRow[],
      collisionInstances: {} as Record<string, CollisionInstance[]>,
    };
  }

  // Find all room collisions
  const roomCollisions = findRoomCollisionsBetweenPlans(plansList);
  const inventoryCollisions = findInventoryCollisionsBetweenPlans(
    plansList,
    bookableItems,
  );

  const numLocationCollisions = getNumCollisions(roomCollisions);
  const numInventoryCollisions = getNumCollisions(inventoryCollisions);

  const numConflictsPerPlanId = getNumConflictsPerPlanId(
    roomCollisions,
    inventoryCollisions,
  );

  const roomDisplayRows = getSpectatorRoomDisplayRows(planMap, roomCollisions);
  const inventoryDisplayRows = getSpectatorInventoryDisplayRows(
    planMap,
    inventoryCollisions,
  );

  // merge room and inventory collisions
  const collisionInstances: CollisionInstancesPerPlan = {};
  for (const [planId, collisions] of Object.entries(roomCollisions)) {
    const collisionInstancesForPlan = collisionInstances[planId] ?? [];
    for (const [booking1, booking2] of collisions) {
      collisionInstancesForPlan.push([booking1, booking2]);
    }
    collisionInstances[planId] = collisionInstancesForPlan;
  }

  for (const [planId, collisions] of Object.entries(inventoryCollisions)) {
    const collisionInstancesForPlan = collisionInstances[planId] ?? [];
    for (const [booking1, booking2] of collisions) {
      collisionInstancesForPlan.push([booking1, booking2]);
    }
    collisionInstances[planId] = collisionInstancesForPlan;
  }

  const spectatorDisplayRows = [
    ...roomDisplayRows,
    ...inventoryDisplayRows,
  ].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  return {
    summary: {
      total: numLocationCollisions + numInventoryCollisions,
      location: numLocationCollisions,
      inventory: numInventoryCollisions,
      publicPlansCount: plansList.length,
    },
    collisionsByPlanId: numConflictsPerPlanId,
    collisionsByKar: getSumConflictsByKar(planMap, numConflictsPerPlanId),
    spectatorDisplayRows: spectatorDisplayRows,
    collisionInstances: collisionInstances,
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

const getSpectatorRoomDisplayRows = (
  plans: Record<string, Plan>,
  planCollisions: CollisionsPerPlan,
): CollisionDisplayRow[] => {
  const displayRows: CollisionDisplayRow[] = [];

  /*
   *  Decision: should a collision be displayed for both plans or only one?
   *  - Show only for one
   */

  for (const [planId, collisions] of Object.entries(planCollisions)) {
    const plan1Details = plans[planId];
    if (!plan1Details) continue;

    for (const [booking1, booking2] of collisions) {
      if (
        displayRows.some((row) => row.id === `${booking2.id}-${booking1.id}`) ||
        displayRows.some((row) => row.id === `${booking1.id}-${booking2.id}`)
      )
        continue;

      const plan2Details = plans[booking2.planId];
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
        type: "room" as const,
        bookings: [booking1, booking2],
        startDate: overlappingTimes[0],
        detail,
      });
    }
  }

  return displayRows;
};

const getSpectatorInventoryDisplayRows = (
  plans: Record<string, Plan>,
  planCollisions: InventoryCollisionsPerPlan,
): CollisionDisplayRow[] => {
  const displayRows: CollisionDisplayRow[] = [];

  for (const [planId, collisions] of Object.entries(planCollisions)) {
    const plan1Details = plans[planId];
    if (!plan1Details) continue;

    for (const [booking1, booking2] of collisions) {
      if (
        displayRows.some((row) => row.id === `${booking2.id}-${booking1.id}`) ||
        displayRows.some((row) => row.id === `${booking1.id}-${booking2.id}`)
      )
        continue;

      const plan2Details = plans[booking2.planId];
      if (!plan2Details) continue;

      // Use pre-computed overlap dates from collidingItems
      // (item-level dates may differ from booking dates)
      const collidingItem = booking1.collidingItems[0];
      if (!collidingItem) {
        throw new Error(
          "Why are you in a a collision parsing function without a colliding item? Bro",
        );
      }
      const startDate = collidingItem.startDate;
      const endDate = collidingItem.endDate;
      const startDateStr = formatDate(startDate, "full");
      const endDateStr = formatDate(
        endDate,
        isSameDay(startDate, endDate) ? "short" : "full",
      );

      // Get human-readable names for colliding items
      const itemNames = booking1.collidingItems.map((item) => {
        const itemOption = BOOKABLE_ITEM_OPTIONS.find(
          (opt) => opt.key === item.key,
        );
        return itemOption?.value ?? item.key;
      });
      const detail = `${itemNames.join(", ")}, ${startDateStr}–${endDateStr}`;

      displayRows.push({
        id: `${booking1.id}-${booking2.id}`,
        plan1: plan1Details,
        plan2: plan2Details,
        type: "inventory" as const,
        bookings: [booking1, booking2],
        startDate: startDate,
        detail,
      });
    }
  }

  return displayRows;
};

const getUserConflictsDisplayRows = (
  userPlan: Plan,
  otherPlans: Record<string, Plan>,
  collisions: CollisionInstance[],
): CollisionDisplayRow[] => {
  const displayRows: CollisionDisplayRow[] = [];

  for (const [booking1, booking2] of collisions) {
    const plan2Details = otherPlans[booking2.planId];
    if (!plan2Details) continue;

    if ("collidingItems" in booking1 && "collidingItems" in booking2) {
      const collidingItem = booking1.collidingItems[0];
      if (!collidingItem) {
        throw new Error(
          "Why are you in a a collision parsing function without a colliding item? Yikes",
        );
      }

      const startDate = collidingItem.startDate;
      const endDate = collidingItem.endDate;
      const startDateStr = formatDate(startDate, "full");
      const endDateStr = formatDate(
        endDate,
        isSameDay(startDate, endDate) ? "short" : "full",
      );

      const itemNames = booking1.collidingItems.map((item) => {
        const itemOption = BOOKABLE_ITEM_OPTIONS.find(
          (opt) => opt.key === item.key,
        );
        return itemOption?.value ?? item.key;
      });

      const detail = `${itemNames.join(", ")}, ${startDateStr}–${endDateStr}`;

      displayRows.push({
        id: `${booking1.id}-${booking2.id}`,
        plan1: userPlan,
        plan2: plan2Details,
        type: "inventory" as const,
        bookings: [booking1, booking2],
        startDate,
        detail,
      });

      continue;
    }

    if ("collidingRooms" in booking1 && "collidingRooms" in booking2) {
      const overlappingTimes = getDateRangeOverLaps(
        [booking1.startDate, booking1.endDate],
        [booking2.startDate, booking2.endDate],
      );
      if (!overlappingTimes) {
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
      const rooms =
        booking1?.collidingRooms?.map(
          (roomId) => roomMap[roomId]?.name ?? "Okänt rum",
        ) ?? [];
      const detail = `${location?.name || "Okänd plats"}, ${rooms.join(", ")}, ${startDateStr}–${endDateStr}`;

      displayRows.push({
        id: `${booking1.id}-${booking2.id}`,
        plan1: userPlan,
        plan2: plan2Details,
        type: "room",
        bookings: [booking1, booking2],
        startDate,
        detail,
      });

      continue;
    }

    console.debug("Invalid collision instance", booking1, booking2);
    throw new Error("Invalid collision instance");
  }

  return displayRows.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );
};

/**
 * Sums up the number of collisions by kår for a given set of plans and collisions.
 */
const getSumConflictsByKar = (
  plans: Record<string, Plan>,
  numCollisionsByPlan: NumCollisionsPerPlanId,
): CollisionsByKar => {
  const collisionsByKar: CollisionsByKar = {
    Consensus: 0,
    LinTek: 0,
    StuFF: 0,
    Övrigt: 0,
  };

  for (const id of Object.keys(numCollisionsByPlan)) {
    const planDetails = plans[id];
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

const getEventsFromCollisionDisplayRows = (
  row: CollisionDisplayRow[],
): Booking[] => {
  const events: Booking[] = Array.from(
    new Map(
      row.flatMap((row) =>
        row.bookings.map((booking) => [
          booking.id,
          {
            id: booking.id,
            title: booking.title,
            allDay: false,
            committeeId: booking.committeeId,
            planId: booking.planId,
            locationId: booking.locationId,
            roomId: booking.roomId,
            alcohol: false,
            food: false,
            link: booking.link,
            bookableItems: booking.bookableItems,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
          } satisfies Booking,
        ]),
      ),
    ).values(),
  );

  return events;
};

export type {
  CollisionSummary,
  CollisionDisplayRow,
  CollisionsByKar,
  NumCollisionsPerPlanId,
  CollisionInstancesPerPlan,
};
export {
  computeCollisionsV2,
  getUserConflictsDisplayRows,
  getEventsFromCollisionDisplayRows,
};
