import { useBoundStore } from "@/state/store";

export const useStorePlanYear = () => {
  return {
    planYear: useBoundStore((state) => state.planYear),
    incrementPlanYear: useBoundStore((state) => state.incrementPlanYear),
    decrementPlanYear: useBoundStore((state) => state.decrementPlanYear),
  };
};
