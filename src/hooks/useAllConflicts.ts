import { useMemo } from "react";
import { findInventoryCollisionsBetweenEvents } from "@/utils/inventoryCollisions";
import { findRoomCollisionsBetweenEvents } from "@/utils/roomCollisions";
import { usePublicPlans } from "./usePublicPlans";

export interface AllConflictsSummary {
  total: number;
  location: number;
  inventory: number;
  publicPlansCount: number;
}

export interface PlanConflictInfo {
  planId: string;
  conflictCount: number;
}

export const useAllConflicts = () => {
  const { publicPlans, isPending } = usePublicPlans();

  const result = useMemo(() => {
    if (publicPlans.length === 0) {
      return {
        summary: {
          total: 0,
          location: 0,
          inventory: 0,
          publicPlansCount: 0,
        },
        conflictsByPlanId: {} as Record<string, number>,
      };
    }

    // Get all events from all public plans
    const allEvents = publicPlans.flatMap((plan) => plan.events);

    // Find all room collisions
    const roomCollisions = findRoomCollisionsBetweenEvents(allEvents);
    const locationCount = Math.ceil(roomCollisions.length / 2);

    // Find all inventory collisions
    const { collisions: inventoryCollisions } =
      findInventoryCollisionsBetweenEvents(allEvents);
    const inventoryCount = Math.ceil(inventoryCollisions.length / 2);

    // Calculate conflicts per plan
    const conflictsByPlanId: Record<string, number> = {};

    publicPlans.forEach((plan) => {
      // Count room collisions involving this plan
      const planRoomCollisions = roomCollisions.filter(
        (booking) => booking.planId === plan.id,
      );

      // Count inventory collisions involving this plan
      const planInventoryCollisions = inventoryCollisions.filter(
        (booking) => booking.planId === plan.id,
      );

      // Each collision appears twice (once for each plan), so divide by 2 and round
      const totalForPlan = Math.ceil(
        (planRoomCollisions.length + planInventoryCollisions.length) / 2,
      );

      conflictsByPlanId[plan.id] = totalForPlan;
    });

    return {
      summary: {
        total: locationCount + inventoryCount,
        location: locationCount,
        inventory: inventoryCount,
        publicPlansCount: publicPlans.length,
      },
      conflictsByPlanId,
    };
  }, [publicPlans]);

  const getConflictsForPlan = (planId: string): number => {
    return result.conflictsByPlanId[planId] || 0;
  };

  return {
    summary: result.summary,
    conflictsByPlanId: result.conflictsByPlanId,
    getConflictsForPlan,
    isPending,
  };
};
