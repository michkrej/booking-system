import { useQuery } from "@tanstack/react-query";
import { plansService } from "@/services";
import { usePlanYear, useUser } from "@/state/store";

export const usePublicPlans = () => {
  const { planYear: year } = usePlanYear();
  const { user } = useUser();

  const { data = [], isFetching } = useQuery({
    queryKey: ["publicPlans", year],
    queryFn: async () => {
      const plans = await plansService.getPublicPlans(user, year);
      return plans;
    },
  });

  return { publicPlans: data, isPending: isFetching };
};
