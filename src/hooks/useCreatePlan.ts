import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { Plan } from "@/interfaces/interfaces";
import { plansService } from "@/services";
import { useActiveYear } from "./useActiveYear";
import { useStoreUser } from "./useStoreUser";
import { useTimelineEvents } from "./useTimelineEvents";
import { userPlansQueryKey } from "./useUserPlans";

const createPlanQueryKey = ["createPlan"];

export const useCreatePlan = () => {
  const { user } = useStoreUser();
  const { activeYear } = useActiveYear();
  const { setTimelineEvents } = useTimelineEvents();

  const queryClient = useQueryClient();

  const createPlanIsPending =
    useIsMutating({
      mutationKey: ["createPlan"],
    }) > 0;

  const createPlanMutation = useMutation({
    mutationKey: createPlanQueryKey,
    mutationFn: (planName: string) => {
      return plansService.createPlan({
        label: planName,
        userId: user.id,
        public: false,
        committeeId: user.committeeId,
        year: activeYear,
        events: [],
      });
    },
    onSuccess: (newPlan) => {
      queryClient.setQueryData(
        userPlansQueryKey(activeYear, user.id),
        (prev: Plan[]) => [...prev, newPlan],
      );
      setTimelineEvents([]);

      toast.success("Planeringen skapades");
    },
    onError: () => {
      toast.error("Kunde inte skapa planeringen");
    },
  });

  return {
    createPlan: createPlanMutation.mutate,
    isPending: createPlanIsPending,
  };
};
