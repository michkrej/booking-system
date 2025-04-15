import { getCommittee } from "@/lib/utils";
import { useMemo } from "react";
import { usePublicPlans } from "./usePublicPlans";

export const usePublicPlansByKår = () => {
  const { publicPlans: plans } = usePublicPlans();
  return useMemo(() => {
    const filterByKår = (kår: string) =>
      plans.filter((plan) => getCommittee(plan.committeeId)?.kår === kår);
    return {
      lintek: filterByKår("LinTek"),
      consensus: filterByKår("Consensus"),
      stuff: filterByKår("StuFF"),
    };
  }, [plans]);
};
