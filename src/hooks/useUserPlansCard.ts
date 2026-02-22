import { useState } from "react";
import { useActiveYear } from "./useActiveYear";
import { useLoadTimelineData } from "./useLoadTimelineData";
import { useUserPlanConflicts } from "./useUserPlanConflicts";
import { useUserPlans } from "./useUserPlans";

export const useUserPlansCard = () => {
  const { isLoading, userPlans } = useUserPlans();
  const { getNumCollisionsForPlan } = useUserPlanConflicts();
  const { activeYear } = useActiveYear();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { handlePlanClick } = useLoadTimelineData();

  return {
    userPlans,
    isLoading,
    handlePlanClick,
    getNumCollisionsForPlan,
    activeYear,
    showCreateDialog,
    setShowCreateDialog,
  };
};
