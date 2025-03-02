import { type StateCreator } from "zustand";
import { type PlanStoreSlice } from "./planStoreSlice";
import { type Plan, type Booking } from "@/utils/interfaces";

type BookingStoreSlice = {
  bookings: Booking[];
  createdBooking: (booking: Booking) => void;
  deletedBooking: (booking: Booking) => void;
  updatedBooking: (booking: Booking) => void;
  loadedBookings: (bookings: Booking[]) => void;
};

const updatePlansEventList = (
  plans: Plan[],
  booking: Booking,
  action: "add" | "remove" | "update",
) => {
  return plans.map((plan) => {
    if (plan.id === booking.planId) {
      return {
        ...plan,
        events:
          action === "remove"
            ? plan.events.filter((event) => event.id !== booking.id)
            : [...plan.events, booking],
      };
    }
    return plan;
  });
};

const createBookingStoreSlice: StateCreator<
  BookingStoreSlice & PlanStoreSlice,
  [],
  [],
  BookingStoreSlice
> = (set, get) => ({
  bookings: [],
  createdBooking: (booking) => {
    const updatedPlansList = updatePlansEventList(
      get().activePlans,
      booking,
      "add",
    );

    set((state) => ({
      bookings: [...state.bookings, booking],
      activePlans: updatedPlansList,
    }));
  },
  deletedBooking: (bookingToDelete) => {
    set((state) => {
      const bookings = state.bookings.filter(
        (booking) => booking.id !== bookingToDelete.id,
      );
      const updatedPlansList = updatePlansEventList(
        get().activePlans,
        bookingToDelete,
        "remove",
      );

      return {
        bookings,
        activePlans: updatedPlansList,
      };
    });
  },
  updatedBooking: (updatedBooking) => {
    set((state) => {
      const bookings = state.bookings.map((booking) => {
        if (updatedBooking.id === booking.id) {
          return {
            ...booking,
            ...updatedBooking,
          };
        }
        return booking;
      });
      const updatedPlansList = updatePlansEventList(
        get().activePlans,
        updatedBooking,
        "update",
      );

      return {
        bookings,
        activePlans: updatedPlansList,
      };
    });
  },
  loadedBookings: (bookings) => {
    set(() => ({
      bookings: bookings,
    }));
  },
});

export { createBookingStoreSlice };
export type { BookingStoreSlice };
