import { useQuery } from "@tanstack/react-query";
import { plansService } from "@/services";
import { useStoreUser } from "./useStoreUser";
import { useStorePlanYear } from "./useStorePlanYear";
import { useStorePlanActions } from "./useStorePlanActions";
import { useBoundStore } from "@/state/store";

export const useUserPlans = () => {
  const { user } = useStoreUser();
  const { planYear: year } = useStorePlanYear();
  const { userPlansLoaded } = useStorePlanActions();

  const { isFetching } = useQuery({
    queryKey: ["userPlans", year, user.id],
    queryFn: async () => {
      const plans = await plansService.getUserPlans(user.id, year);
      userPlansLoaded(plans);
      return plans;
    },
  });

  return {
    userPlans: useBoundStore((state) => state.userPlans) ?? [],
    isPending: isFetching,
  };
};
