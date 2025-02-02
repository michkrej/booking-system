import { useQuery } from "@tanstack/react-query";
import { plansService } from "@/services";
import { usePlanYear, useUser } from "@/state/store";

export const useUserPlans = () => {
  const { planYear: year } = usePlanYear();
  const { user } = useUser();

  const { data = [], isFetching } = useQuery({
    queryKey: ["userPlans", year],
    queryFn: async () => {
      const plans = await plansService.getUserPlans(user, year);
      return plans;
    },
  });

  return { userPlans: data, isPending: isFetching };
};
