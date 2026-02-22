import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Plan } from "@/interfaces/interfaces";
import { plansService } from "@/services";
import { useActiveYear } from "./useActiveYear";
import { useStoreUser } from "./useStoreUser";

export const userPlansQueryKey = (
  year: number,
  userId: string,
): ["userPlans", number, string] => ["userPlans" as const, year, userId];

export const useUserPlans = () => {
  const { user } = useStoreUser();
  const { activeYear } = useActiveYear();

  const { data, isLoading } = useQuery({
    queryKey: userPlansQueryKey(activeYear, user.id),
    queryFn: () => plansService.getUserPlans(user.id, activeYear),
  });

  const plans: Plan[] = useMemo(() => data ?? [], [data]);

  const userPublicPlan = useMemo(() => {
    return plans.find((plan) => plan.public);
  }, [plans]);

  return {
    userPlans: plans,
    publicPlan: userPublicPlan,
    isLoading,
  };
};
