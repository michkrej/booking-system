import { useMemo } from "react";
import {
  type CollisionDisplayRow,
  getUserConflictsDisplayRows,
} from "@/utils/collisionComputation";
import { useCollisions } from "./useCollisions";
import { usePublicPlans } from "./usePublicPlans";
import { useUserPlans } from "./useUserPlans";

export interface PlanConflictCounts {
  location: number;
  inventory: number;
  total: number;
}

export const useUserPlanConflicts = () => {
  const { publicPlan: userPublicPlan } = useUserPlans();
  const { publicPlans } = usePublicPlans();
  const { getConflictsForPlan, collisionInstances } = useCollisions();

  const conflictRows: CollisionDisplayRow[] = useMemo(() => {
    if (!userPublicPlan) return [];

    const conflicts = collisionInstances[userPublicPlan.id];
    if (!conflicts) return [];

    const displayRows = getUserConflictsDisplayRows(
      userPublicPlan,
      publicPlans.filter((plan) => plan.id !== userPublicPlan.id),
      conflicts,
    );

    return displayRows;
  }, [userPublicPlan, publicPlans]);

  return {
    conflictRows,
    getConflictsForPlan,
  };
};
