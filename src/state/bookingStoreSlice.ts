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
    }));
  },
  deletedBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
    }));
  },
  updatedBooking: (updatedBooking) => {
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
  loadedBookings: (bookings) => {
    set(() => ({
      bookings: bookings,
    }));
  },
});

export { createBookingStoreSlice };
export type { BookingStoreSlice };
