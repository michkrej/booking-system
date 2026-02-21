import { useMemo } from "react";
import type { CollisionsPerPlan } from "@/utils/collision/findRoomCollisionsBetweenPlans";
import {
  type CollisionDisplayRow,
  type CollisionSummary,
  type CollisionsByKar,
  type NumCollisionsPerPlanId,
  computeCollisionsV2,
} from "@/utils/collisionComputation";
import { usePublicPlans } from "./usePublicPlans";

export interface UseCollisionsReturn {
  summary: CollisionSummary;
  conflictsByPlanId: NumCollisionsPerPlanId;
  getConflictsForPlan: (planId: string) => {
    room: number;
    inventory: number;
    summary: number;
  };
  collisionsByKar: CollisionsByKar;
  collisionInstances: CollisionsPerPlan;
  displayRows: CollisionDisplayRow[];
  isPending: boolean;
}

export const useCollisions = (): UseCollisionsReturn => {
  const { publicPlans, isPending } = usePublicPlans();

  const result = useMemo(() => computeCollisionsV2(publicPlans), [publicPlans]);

  const getNumConflictsForPlan = (planId: string) => {
    return (
      result.conflictsByPlanId[planId] || { room: 0, inventory: 0, summary: 0 }
    );
  };

  return {
    summary: result.summary,
    conflictsByPlanId: result.conflictsByPlanId,
    getConflictsForPlan: getNumConflictsForPlan,
    collisionsByKar: result.collisionsByKar,
    displayRows: result.spectatorDisplayRows,
    collisionInstances: result.collisionInstances,
    isPending,
  };
};
