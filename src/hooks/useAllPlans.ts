// gets both user and public plans and spreads into one array
import { useMemo } from "react";
import type { Plan } from "@/interfaces/interfaces";
import { usePublicPlans } from "./usePublicPlans";
import { useUserPlans } from "./useUserPlans";

export const useAllPlans = () => {
  const { userPlans } = useUserPlans();
  const { publicPlans, publicPlansMap } = usePublicPlans();

  const res = useMemo(() => {
    const user = userPlans.filter((plan) => plan.public === false);

    const map: Record<string, Plan> = { ...publicPlansMap };
    user.forEach((plan) => (map[plan.id] = plan));

    const list = [...user, ...publicPlans];

    return {
      map,
      list,
    };
  }, [userPlans, publicPlans]);

  return {
    plansMap: res.map,
    plans: res.list,
  };
};
