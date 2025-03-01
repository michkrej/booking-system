import { useQuery } from "@tanstack/react-query";
import { plansService } from "@/services";
import { useStorePlanYear } from "./useStorePlanYear";

export const usePublicPlans = () => {
  const { planYear: year } = useStorePlanYear();

  const { data = [], isFetching } = useQuery({
    queryKey: ["publicPlans", year],
    queryFn: async () => {
      const plans = await plansService.getPublicPlans(year);
      return plans;
    },
  });

  return { publicPlans: data, isPending: isFetching };
};
