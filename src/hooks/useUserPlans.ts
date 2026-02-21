import { useQuery } from "@tanstack/react-query";
import { plansService } from "@/services";
import { useBoundStore } from "@/state/store";
import { useStorePlanActions } from "./useStorePlanActions";
import { useStorePlanYear } from "./useStorePlanYear";
import { useStoreUser } from "./useStoreUser";

export const useUserPlans = () => {
  const { user } = useStoreUser();
  const { planYear: year } = useStorePlanYear();
  const { userPlansLoaded } = useStorePlanActions();

  const { isPending } = useQuery({
    queryKey: ["userPlans", year, user.id],
    queryFn: async () => {
      const plans = await plansService.getUserPlans(user.id, year);
      userPlansLoaded(plans);
      return plans;
    },
  });

  const plans = useBoundStore((state) => state.userPlans) ?? [];

  return {
    userPlans: plans,
    publicPlan: plans.filter((plan) => plan.public)[0] ?? null,
    isPending,
  };
};
