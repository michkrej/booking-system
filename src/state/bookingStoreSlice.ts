import { type StateCreator } from "zustand";
import { type PlanStoreSlice } from "./planStoreSlice";
import { type Booking } from "@/utils/interfaces";

type BookingStoreSlice = {
  bookings: Booking[];
  createBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  updateBooking: (booking: Booking) => void;
  setInitialBookings: (bookings: Booking[]) => void;
};

const createBookingStoreSlice: StateCreator<
  BookingStoreSlice & PlanStoreSlice,
  [],
  [],
  BookingStoreSlice
> = (set) => ({
  bookings: [],
  createBooking: (booking) => {
    set((state) => ({
      bookings: [...state.bookings, booking],
    }));
  },
  deleteBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
    }));
  },
  updateBooking: (updatedBooking) => {
    set((state) => ({
      bookings: state.bookings.map((booking) => {
        if (updatedBooking.id === booking.id) {
          return {
            ...booking,
            ...updatedBooking,
          };
        }
        return booking;
      }),
    }));
  },
  setInitialBookings: (bookings) => {
    set(() => ({
      bookings: bookings,
    }));
  },
});

export { createBookingStoreSlice };
export type { BookingStoreSlice };
