import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { plansService } from "@/services";
import {
  useHasPublicPlan,
  usePlanActions,
  usePlanYear,
  useUser,
} from "@/state/store";
import { type Plan } from "@/utils/interfaces";

export const useEditPlan = () => {
  const { user } = useUser();
  const {
    userPlanDeleted,
    userPlanUpdated,
    userPlanCreated,
    userPlanPublicToggled,
  } = usePlanActions();
  const { planYear } = usePlanYear();
  const hasPublicPlan = useHasPublicPlan();

  const createPlan = useMutation({
    mutationFn: (planName: string) => {
      return plansService.createPlan({
        label: planName,
        userId: user.id,
        public: false,
        committeeId: user.committeeId,
        year: planYear,
        events: [],
      });
    },
    onSuccess: (value) => {
      userPlanCreated(value);
      toast.success("Planeringen skapades");
    },
    onError: () => {
      toast.error("Kunde inte skapa planeringen");
    },
  });

  const updatePlanName = useMutation({
    mutationFn: ({
      plan,
      newPlanName,
    }: {
      plan: Plan;
      newPlanName: string;
    }) => {
      return plansService.updatePlanDetails(plan.id, { label: newPlanName });
    },
    onSuccess: (value, { plan: { label: oldName } }) => {
      userPlanUpdated({
        id: value.id,
        label: value.label,
        updatedAt: value.updatedAt,
      });
      toast.success(
        `Planeringen '${oldName}' bytte namn till '${value.label}'`,
      );
    },
    onError: () => {
      toast.error("Kunde inte byta namn på planeringen");
    },
  });

  const deletePlan = useMutation({
    mutationFn: (planId: string) => {
      return plansService.deletePlan(planId);
    },
    onSuccess: (id) => {
      toast.success("Planeringen har raderats");
      userPlanDeleted(id);
    },
    onError: () => {
      toast.error("Kunde inte radera planeringen");
    },
  });

  const togglePublicPlan = useMutation({
    mutationFn: (plan: Plan) => {
      if (!plan.public && hasPublicPlan) {
        toast.error("Du kan bara ha en publik planering åt gången");
      }
      return plansService.updatePlanDetails(plan.id, {
        public: !hasPublicPlan,
      });
    },
    onSuccess: (value) => {
      toast.success(
        `Planeringen '${value.label}' är nu ${!hasPublicPlan ? "publik" : "privat"}`,
      );
      userPlanPublicToggled(value.id);
    },
    onError: () => {
      toast.error("Kunde inte ändra planeringens public status");
    },
  });

  return {
    updatePlanName,
    togglePublicPlan,
    deletePlan,
    createPlan,
  };
};
