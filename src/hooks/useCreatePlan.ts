import { useIsMutating, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBoundStore } from "@state/store";
import { plansService } from "@/services";
import { useStoreBookings } from "./useStoreBookings";
import { useStorePlanActions } from "./useStorePlanActions";
import { useStorePlanYear } from "./useStorePlanYear";
import { useStoreUser } from "./useStoreUser";

export const useCreatePlan = () => {
  const { user } = useStoreUser();
  const { userPlanCreated } = useStorePlanActions();
  const { planYear } = useStorePlanYear();
  const changedActivePlans = useBoundStore((state) => state.changedActivePlans);
  const bookings = useStoreBookings();
  const navigate = useNavigate();

  const createPlanIsPending =
    useIsMutating({
      mutationKey: ["createPlan"],
    }) > 0;

  const createPlanMutation = useMutation({
    mutationKey: ["createPlan"],
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

  const createPlan = ({
    planName,
    onSuccess,
    onError,
    onSettled,
  }: {
    planName: string;
    onSuccess?: () => void;
    onError?: () => void;
    onSettled?: () => void;
  }) => {
    createPlanMutation.mutate(planName, {
      onSuccess: (newPlan) => {
        userPlanCreated(newPlan);
        changedActivePlans([newPlan]);
        bookings.loadedBookings([]);

        toast.success("Planeringen skapades");

        navigate(`/booking/${newPlan.id}`);
        onSuccess?.();
      },
      onError: () => {
        toast.error("Kunde inte skapa planeringen");
        onError?.();
      },
      onSettled: () => onSettled?.(),
    });
  };

  return {
    createPlan,
    isPending: createPlanIsPending,
  };
};
