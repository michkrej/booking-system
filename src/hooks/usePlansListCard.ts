import { useNavigate } from "react-router-dom";
import type { Plan } from "@/interfaces/interfaces";
import { useBoundStore } from "@/state/store";
import { useCurrentDate } from "./useCurrentDate";
import { useUserPlans } from "./useUserPlans";

export const usePlansListCard = () => {
  const { isPending, userPlans } = useUserPlans();

  const loadedBookings = useBoundStore((state) => state.loadedBookings);
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const navigate = useNavigate();
  const { resetCurrentDate } = useCurrentDate();

  const handlePlanClick = (plan: Plan) => {
    loadedBookings(plan.events);
    changedActivePlans([plan]);
    resetCurrentDate();
    navigate(`/booking/${plan.id}`);
  };

  return {
    userPlans,
    isPending,
    handlePlanClick,
  };
};
