import { useMemo } from "react";
import { findCollisionsBetweenUserAndPublicPlans } from "@/utils/helpers";
import { usePublicPlans } from "./usePublicPlans";
import { useUserPlans } from "./useUserPlans";

export interface PlanConflictCounts {
  location: number;
  inventory: number;
  total: number;
}

export const useUserPlanConflicts = () => {
  const { userPlans } = useUserPlans();
  const { publicPlans } = usePublicPlans();

  const conflictsByPlanId = useMemo(() => {
    const result: Record<string, PlanConflictCounts> = {};

    userPlans.forEach((userPlan) => {
      // Filter out the user's own public plan from comparison
      const otherPublicPlans = publicPlans.filter(
        (plan) => plan.id !== userPlan.id,
      );

      if (otherPublicPlans.length === 0) {
        result[userPlan.id] = { location: 0, inventory: 0, total: 0 };
        return;
      }

      const collisions = findCollisionsBetweenUserAndPublicPlans(
        userPlan,
        otherPublicPlans,
      );

      // Count unique collisions (divide by 2 since each collision appears twice)
      let locationCount = 0;
      let inventoryCount = 0;

      Object.values(collisions.roomCollisions).forEach((bookings) => {
        locationCount += Math.ceil(bookings.length / 2);
      });

      Object.values(collisions.inventoryCollisions).forEach((bookings) => {
        inventoryCount += Math.ceil(bookings.length / 2);
      });

      result[userPlan.id] = {
        location: locationCount,
        inventory: inventoryCount,
        total: locationCount + inventoryCount,
      };
    });

    return result;
  }, [userPlans, publicPlans]);

  const getConflictsForPlan = (planId: string): PlanConflictCounts => {
    return conflictsByPlanId[planId] || { location: 0, inventory: 0, total: 0 };
  };

  return {
    conflictsByPlanId,
    getConflictsForPlan,
  };
};
