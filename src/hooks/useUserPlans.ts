import { useQuery } from "@tanstack/react-query";
import { plansService } from "@/services";
import {
  useUserPlans as useStoreUserPlans,
  usePlanActions,
  usePlanYear,
  useUser,
} from "@/state/store";

export const useUserPlans = () => {
  const { planYear: year } = usePlanYear();
  const { userPlansLoaded } = usePlanActions();
  const userPlans = useStoreUserPlans();
  const { user } = useUser();

  const { isFetching } = useQuery({
    queryKey: ["userPlans", year],
    queryFn: async () => {
      const plans = await plansService.getUserPlans(user, year);
      userPlansLoaded(plans);
      return plans;
    },
  });

  return { userPlans, isPending: isFetching };
};
