import { useBoundStore } from "@/state/store";

export const useStoreBookings = () => {
  return {
    bookings: useBoundStore((state) => state.bookings),
    createBooking: useBoundStore((state) => state.createBooking),
    deleteBooking: useBoundStore((state) => state.deleteBooking),
    updateBooking: useBoundStore((state) => state.updateBooking),
    setInitialBookings: useBoundStore((state) => state.setInitialBookings),
  };
};
