import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Plan } from "@/interfaces/interfaces";
import { plansService } from "@/services";
import { getCommittee } from "@/utils/utils";
import { useActiveYear } from "./useActiveYear";

export const usePublicPlans = () => {
  const { activeYear } = useActiveYear();

  const {
    data = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["publicPlans", activeYear],
    queryFn: async () => {
      const plans = await plansService.getPublicPlans(activeYear);
      return plans;
    },
  });

  const plans: Plan[] = useMemo(() => data ?? [], [data]);

  const publicPlansByKar = useMemo(() => {
    const filterByKår = (kår: string) =>
      plans.filter(
        (plan) =>
          getCommittee(plan.committeeId)?.kår === kår ||
          getCommittee(plan.committeeId)?.kår === "Övrigt",
      ) ?? [];
    return {
      lintek: filterByKår("LinTek"),
      consensus: filterByKår("Consensus"),
      stuff: filterByKår("StuFF"),
    };
  }, [plans]);

  const publicPlansMap = useMemo(() => {
    const map: Record<string, Plan> = {};
    plans.forEach((plan) => (map[plan.id] = plan));
    return map;
  }, [plans]);

  return {
    publicPlans: data,
    isPending,
    refetch,
    publicPlansByKar,
    publicPlansMap,
  };
};
