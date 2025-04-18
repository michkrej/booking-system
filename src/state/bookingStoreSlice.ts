import { type StateCreator } from "zustand";
import { type Booking, type Plan } from "@/utils/interfaces";
import { type PlanStoreSlice } from "./planStoreSlice";

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
    if (plan.id !== booking.planId) return plan; // Skip plans that don't match

    let updatedEvents = plan.events;

    switch (action) {
      case "remove":
        updatedEvents = plan.events.filter((event) => event.id !== booking.id);
        break;
      case "update":
        updatedEvents = plan.events.map((event) =>
          event.id === booking.id ? booking : event,
        );
        break;
      case "add":
        updatedEvents = [...plan.events, booking];
        break;
    }

    return { ...plan, events: updatedEvents };
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
        state.activePlans,
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
        state.activePlans,
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
