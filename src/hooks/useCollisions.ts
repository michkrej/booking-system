import { useMemo } from "react";
import {
  type CollisionDisplayRow,
  type CollisionInstancesPerPlan,
  type CollisionSummary,
  type CollisionsByKar,
  type NumCollisionsPerPlanId,
  computeCollisionsV2,
} from "@/utils/collision/collisionComputation";
import { useAdminSettings } from "./useAdminSettings";
import { usePublicPlans } from "./usePublicPlans";

export interface UseCollisionsReturn {
  summary: CollisionSummary;
  collisionsByPlanId: NumCollisionsPerPlanId;
  getNumCollisionsForPlan: (planId: string) => {
    room: number;
    inventory: number;
    summary: number;
  };
  collisionsByKar: CollisionsByKar;
  collisionInstances: CollisionInstancesPerPlan;
  displayRows: CollisionDisplayRow[];
  isPending: boolean;
}

export const useCollisions = (): UseCollisionsReturn => {
  const { publicPlans, isPending, publicPlansMap } = usePublicPlans();
  const {
    settings: { bookableItems },
  } = useAdminSettings();

  const result = useMemo(
    () => computeCollisionsV2(publicPlans, publicPlansMap, bookableItems),
    [publicPlans],
  );

  const getNumCollisionsForPlan = (planId: string) => {
    return (
      result.collisionsByPlanId[planId] || { room: 0, inventory: 0, summary: 0 }
    );
  };

  return {
    summary: result.summary,
    collisionsByPlanId: result.collisionsByPlanId,
    getNumCollisionsForPlan,
    collisionsByKar: result.collisionsByKar,
    displayRows: result.spectatorDisplayRows,
    collisionInstances: result.collisionInstances,
    isPending,
  };
};
