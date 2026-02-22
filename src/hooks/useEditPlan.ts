import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type Plan } from "@/interfaces/interfaces";
import { plansService } from "@/services";
import { useActiveYear } from "./useActiveYear";
import { useStoreUser } from "./useStoreUser";
import { useUserPlans, userPlansQueryKey } from "./useUserPlans";

export const useEditPlan = () => {
  const { user } = useStoreUser();
  const { publicPlan: userPublicPlan } = useUserPlans();
  const { activeYear } = useActiveYear();

  const queryClient = useQueryClient();

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
      queryClient.setQueryData(
        userPlansQueryKey(activeYear, user.id),
        (prev: Plan[]) =>
          prev.map((plan) => {
            if (plan.id === plan.id) {
              return {
                ...plan,
                label: value.label,
                updatedAt: value.updatedAt,
              };
            }
            return plan;
          }),
      );

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

      queryClient.setQueryData(
        userPlansQueryKey(activeYear, user.id),
        (prev: Plan[]) => prev.filter((plan) => plan.id !== id),
      );
    },
    onError: () => {
      toast.error("Kunde inte radera planeringen");
    },
  });

  const togglePublicPlan = useMutation({
    mutationFn: (plan: Plan) => {
      if (!plan.public && userPublicPlan) {
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

      queryClient.setQueryData(
        userPlansQueryKey(activeYear, user.id),
        (prev: Plan[]) =>
          prev.map((plan) => {
            if (plan.id === value.id) {
              return {
                ...plan,
                public: !plan.public,
              };
            }
            return plan;
          }),
      );

      void queryClient.invalidateQueries({
        queryKey: ["publicPlans", activeYear],
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
  };
};
