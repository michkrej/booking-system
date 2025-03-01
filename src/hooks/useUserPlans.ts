import { useQuery } from "@tanstack/react-query";
import { plansService } from "@/services";
import { usePlanActions, usePlanYear, useUser } from "@/state/store";

export const useUserPlans = () => {
  const { planYear: year } = usePlanYear();
  const { userPlansLoaded } = usePlanActions();
  const { user } = useUser();

  const { data = [], isFetching } = useQuery({
    queryKey: ["userPlans", year],
    queryFn: async () => {
      const plans = await plansService.getUserPlans(user, year);
      userPlansLoaded(plans);
      return plans;
    },
  });

  return { userPlans: data, isPending: isFetching };
};
