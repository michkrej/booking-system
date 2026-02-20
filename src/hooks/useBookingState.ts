import { useState } from "react";
import {
  type Booking,
  type Location,
  type NewBooking,
} from "@/interfaces/interfaces";
import { type View } from "@/pages/Booking/components/ScheduleToolbar";
import { useBoundStore } from "@/state/store";
import { defaultCampus } from "@/utils/helpers";
import { useStoreBookings } from "./useStoreBookings";
import { useStoreUser } from "./useStoreUser";

export const useBookingState = () => {
  const { user } = useStoreUser();
  const { bookings, deletedBooking, updatedBooking } = useStoreBookings();
  const activePlans = useBoundStore((state) => state.activePlans);

  const [currentView, setCurrentView] = useState<View>("TimelineDay");
  const [chosenCampus, setChosenCampus] = useState(
    defaultCampus(user.committeeId).label,
  );
  const [building, setBuilding] = useState<Location | undefined>();
  const [editBooking, setEditBooking] = useState<Booking | undefined>();
  const [newBooking, setNewBooking] = useState<NewBooking | undefined>();
  const [action, setAction] = useState<"create" | "edit">("create");
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] =
    useState(false);
  const [isUpdateBookingModalOpen, setIsUpdateBookingModalOpen] =
    useState(false);

  return {
    currentView,
    setCurrentView,
    chosenCampus,
    setChosenCampus,
    building,
    setBuilding,
    editBooking,
    setEditBooking,
    newBooking,
    setNewBooking,
    action,
    setAction,
    isCreateBookingModalOpen,
    setIsCreateBookingModalOpen,
    isUpdateBookingModalOpen,
    setIsUpdateBookingModalOpen,
    bookings,
    deletedBooking,
    updatedBooking,
    activePlans,
    user,
  };
};
