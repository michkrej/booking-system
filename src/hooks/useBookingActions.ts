import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { type Booking, type Plan } from "@/interfaces/interfaces";
import { plansService } from "@/services";

export const useBookingActions = () => {
  const addBookingToPlanMutation = useMutation({
    mutationFn: ({
      plan,
      booking,
    }: {
      plan: Plan | null;
      booking: Booking;
    }) => {
      if (!plan) throw new Error("Plan not found");
      return plansService.addPlanEvent(plan, booking);
    },
    onSuccess: () => {
      toast.success("Bokning har lagts till i planeringen");
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
      return plansService.updatePlanEvent(plan, booking);
    },
    onSuccess: () => {
      toast.success("Bokning har uppdaterats");
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
      return plansService.deletePlanEvent(plan, booking.id);
    },
    onSuccess: () => {
      toast.success("Bokning har raderats");
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
