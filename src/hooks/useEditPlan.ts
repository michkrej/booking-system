import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { plansService } from "@/services";
import { type Plan } from "@/utils/interfaces";
import { useStorePlanActions } from "./useStorePlanActions";
import { useStoreUser } from "./useStoreUser";
import { useStorePlanYear } from "./useStorePlanYear";
import { useBoundStore } from "@/state/store";
//import { useUserPlans } from "./useUserPlans";

export const useEditPlan = () => {
  const { user } = useStoreUser();
  const {
    userPlanDeleted,
    userPlanUpdated,
    userPlanCreated,
    userPlanPublicToggled,
  } = useStorePlanActions();
  const { planYear } = useStorePlanYear();
  const hasPublicPlan = useBoundStore((state) => state.hasPublicPlan);
  const queryClient = useQueryClient();

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
        throw new Error("singlePublicPlan");
      }
      return plansService.updatePlanDetails(plan.id, {
        public: !plan.public,
      });
    },
    onSuccess: (value, oldPlan) => {
      toast.success(
        `Planeringen '${oldPlan.label}' är nu ${!oldPlan.public ? "publik" : "privat"}`,
      );
      userPlanPublicToggled(value.id);
      void queryClient.invalidateQueries({
        queryKey: ["publicPlans", planYear],
      });
    },
    onError: (error) => {
      if (error.message === "singlePublicPlan") {
        toast.error("Du kan bara ha en publik planering åt gången");
        return;
      }
      toast.error("Kunde inte uppdatera planeringen");
    },
  });

  return {
    updatePlanName,
    togglePublicPlan,
    deletePlan,
    createPlan,
  };
};
