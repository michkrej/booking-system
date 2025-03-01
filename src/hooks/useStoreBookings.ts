import { useBoundStore } from "@/state/store";

export const useStoreBookings = () => {
  return {
    bookings: useBoundStore((state) => state.bookings),
    createdBooking: useBoundStore((state) => state.createdBooking),
    deletedBooking: useBoundStore((state) => state.deletedBooking),
    updatedBooking: useBoundStore((state) => state.updatedBooking),
    loadedBookings: useBoundStore((state) => state.loadedBookings),
  };
};
