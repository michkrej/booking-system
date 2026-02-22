import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type Booking, type Plan } from "@/interfaces/interfaces";
import { plansService } from "@/services";
import { updatePlansEventList } from "@/utils/helpers";
import { useActiveYear } from "./useActiveYear";
import { useStoreUser } from "./useStoreUser";
import { useTimelineEvents } from "./useTimelineEvents";
import { userPlansQueryKey } from "./useUserPlans";

export const useBookingActions = () => {
  const { user } = useStoreUser();
  const queryClient = useQueryClient();
  const { activeYear } = useActiveYear();
  const { addEvent, updateEvent, deleteEvent } = useTimelineEvents();

  const addBookingToPlanMutation = useMutation({
    mutationFn: ({
      plan,
      booking,
    }: {
      plan: Plan | null;
      booking: Booking;
    }) => {
      if (!plan) throw new Error("Plan not found");
      if (plan.id !== booking.planId) throw new Error("Wrong plan");
      if (plan.userId !== user.id) throw new Error("Wrong user");
      return plansService.addPlanEvent(plan, booking);
    },
    onSuccess: (booking) => {
      toast.success("Bokning har lagts till i planeringen");

      queryClient.setQueryData(
        userPlansQueryKey(activeYear, user.id),
        (prev: Plan[]) => {
          const newPlans = updatePlansEventList(prev ?? [], booking, "add");
          return newPlans;
        },
      );

      addEvent(booking);
    },
    onError: () => {
      toast.error("Kunde inte lägga till bokning i planeringen");
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({
      plan,
      booking,
    }: {
      plan: Plan | null;
      booking: Booking;
    }) => {
      if (!plan) throw new Error("Plan not found");
      if (plan.id !== booking.planId) throw new Error("Wrong plan");
      if (plan.userId !== user.id) throw new Error("Wrong user");
      return plansService.updatePlanEvent(plan, booking);
    },
    onSuccess: (booking) => {
      toast.success("Bokning har uppdaterats");

      queryClient.setQueryData(
        userPlansQueryKey(activeYear, user.id),
        (prev: Plan[]) => updatePlansEventList(prev ?? [], booking, "update"),
      );

      updateEvent(booking);
    },
    onError: () => {
      toast.error("Kunde inte uppdatera bokningen");
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: ({
      booking,
      plan,
    }: {
      booking: Booking;
      plan: Plan | null;
    }) => {
      if (!plan) throw new Error("Plan not found");
      if (plan.id !== booking.planId) throw new Error("Wrong plan");
      if (plan.userId !== user.id) throw new Error("Wrong user");
      return plansService.deletePlanEvent(plan, booking);
    },
    onSuccess: (booking) => {
      toast.success("Bokning har raderats");

      queryClient.setQueryData(
        userPlansQueryKey(activeYear, user.id),
        (prev: Plan[]) => updatePlansEventList(prev ?? [], booking, "remove"),
      );
      deleteEvent(booking);
    },
    onError: () => {
      toast.error("Kunde inte radera bokningen");
    },
  });

  return {
    addBookingToPlanMutation,
    updateBookingMutation,
    deleteBookingMutation,
  };
};
