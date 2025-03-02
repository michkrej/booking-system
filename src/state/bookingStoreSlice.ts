import { type StateCreator } from "zustand";
import { type PlanStoreSlice } from "./planStoreSlice";
import { type Booking } from "@/utils/interfaces";

type BookingStoreSlice = {
  bookings: Booking[];
  createdBooking: (booking: Booking) => void;
  deletedBooking: (id: string) => void;
  updatedBooking: (booking: Booking) => void;
  loadedBookings: (bookings: Booking[]) => void;
};

const createBookingStoreSlice: StateCreator<
  BookingStoreSlice & PlanStoreSlice,
  [],
  [],
  BookingStoreSlice
> = (set) => ({
  bookings: [],
  createdBooking: (booking) => {
    set((state) => ({
      bookings: [...state.bookings, booking],
      currentPlan: state.currentPlan
        ? {
            ...state.currentPlan,
            events: [...state.currentPlan.events, booking],
          }
        : null,
    }));
  },
  deletedBooking: (id) => {
    set((state) => {
      const bookings = state.bookings.filter((booking) => booking.id !== id);
      return {
        bookings,
        currentPlan: state.currentPlan
          ? {
              ...state.currentPlan,
              events: bookings,
            }
          : null,
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
      return {
        bookings,
        currentPlan: state.currentPlan
          ? {
              ...state.currentPlan,
              events: bookings,
            }
          : null,
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
