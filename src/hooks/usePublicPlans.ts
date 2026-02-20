import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { plansService } from "@/services";
import { getCommittee } from "@/utils/utils";
import { useStorePlanYear } from "./useStorePlanYear";

export const usePublicPlans = () => {
  const { planYear: year } = useStorePlanYear();

  const {
    data = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["publicPlans", year],
    queryFn: async () => {
      const plans = await plansService.getPublicPlans(year);
      return plans;
    },
  });

  const publicPlansByKar = useMemo(() => {
    const filterByKår = (kår: string) =>
      data?.filter((plan) => getCommittee(plan.committeeId)?.kår === kår);
    return {
      lintek: filterByKår("LinTek"),
      consensus: filterByKår("Consensus"),
      stuff: filterByKår("StuFF"),
    };
  }, [data]);

  return { publicPlans: data, isPending, refetch, publicPlansByKar };
};
