import { useMemo } from "react";
import {
  type CollisionDisplayRow,
  getUserConflictsDisplayRows,
} from "@/utils/collision/collisionComputation";
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
  const { publicPlansMap } = usePublicPlans();
  const { getNumCollisionsForPlan, collisionInstances } = useCollisions();

  const conflictRows: CollisionDisplayRow[] = useMemo(() => {
    if (!userPublicPlan) return [];

    const collisions = collisionInstances[userPublicPlan.id];
    if (!collisions) return [];

    const displayRows = getUserConflictsDisplayRows(
      userPublicPlan,
      publicPlansMap,
      collisions,
    );

    return displayRows;
  }, [userPublicPlan, publicPlansMap]);

  return {
    conflictRows,
    getNumCollisionsForPlan,
  };
};
