import { useState } from "react";
import {
  useHasPublicPlan,
  usePlanActions,
  usePlanYear,
  useUser,
} from "@/state/store";
import { Plan } from "@/utils/interfaces";
import { plansService } from "@/services";
import { getErrorMessage } from "@/utils/error.util";
import { toast } from "sonner";

export const useEditPlan = () => {
  const { user } = useUser();
  const [isPending, setIsPending] = useState(false);
  const {
    userPlanDeleted,
    userPlanUpdated,
    userPlanCreated,
    userPlanPublicToggled,
  } = usePlanActions();
  const { planYear } = usePlanYear();
  const hasPublicPlan = useHasPublicPlan();

  const changePlanName = async (plan: Plan, name: string) => {
    setIsPending(true);
    const oldPlanName = plan.label;
    plansService
      .updatePlanDetails(plan.id, { label: name })
      .then((updatedPlan) => {
        userPlanUpdated({
          label: name,
          id: plan.id,
          updatedAt: updatedPlan?.updatedAt,
        });
        toast.success(`Planeringen '${oldPlanName}' bytte namn till '${name}'`);
        setIsPending(false);
      })
      .catch((e) => {
        const errorMessage = getErrorMessage(e);
        toast.error(errorMessage);
        setIsPending(false);
      });
  };

  const deletePlan = async (plan: Plan) => {
    setIsPending(true);
    plansService
      .deletePlan(plan.id)
      .then(() => {
        toast.success(`Planeringen '${plan.label}' har raderats`);
        userPlanDeleted(plan.id);
        setIsPending(false);
      })
      .catch((e) => {
        const errorMessage = getErrorMessage(e);
        toast.error(errorMessage);
        setIsPending(false);
      });
  };

  const togglePublicPlan = (plan: Plan) => {
    if (!plan.public && hasPublicPlan) {
      toast.error("Du kan bara ha en publik planering åt gången");
    } else {
      setIsPending(true);
      plansService
        .updatePlanDetails(plan.id, { public: !plan.public })
        .then(() => {
          toast.success(
            `Planeringen '${plan.label}' är nu ${!plan.public ? "publik" : "privat"}`,
          );
          userPlanPublicToggled(plan.id);
          setIsPending(false);
        })
        .catch((e) => {
          const errorMessage = getErrorMessage(e);
          toast.error(errorMessage);
          setIsPending(false);
        });
    }
  };

  const createPlan = async (name: string) => {
    setIsPending(true);
    plansService
      .createPlan({
        label: name,
        userId: user.userId,
        public: false,
        committeeId: user.committeeId,
        year: planYear,
        events: [],
      })
      .then((newPlan) => {
        userPlanCreated({
          ...newPlan,
          label: newPlan.label,
          id: newPlan.id,
          createdAt: newPlan.createdAt,
          updatedAt: newPlan.updatedAt,
        });
        toast.success("Planeringen skapades");
        setIsPending(false);
        //navigate(`/booking/${newPlan.id}/${planYear}`)
      })
      .catch((e) => {
        const errorMessage = getErrorMessage(e);
        toast.error(errorMessage);
        setIsPending(false);
      });
  };

  return {
    changePlanName,
    togglePublicPlan,
    deletePlan,
    createPlan,
    isPending,
  };
};
