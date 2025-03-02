import { type View } from "@/pages/Booking/components/ScheduleToolbar";
import { useBoundStore } from "@/state/store";
import { defaultCampus } from "@/utils/helpers";
import {
  type Location,
  type Booking,
  type NewBooking,
} from "@/utils/interfaces";
import { useState } from "react";
import { useAdminSettings } from "./useAdminSettings";
import { useStoreBookings } from "./useStoreBookings";
import { useStoreUser } from "./useStoreUser";

export const useBookingState = () => {
  const { user } = useStoreUser();
  const { mottagningStart } = useAdminSettings();
  const { bookings, deletedBooking, updatedBooking } = useStoreBookings();
  const activePlans = useBoundStore((state) => state.activePlans);

  const [currentDate, setCurrentDate] = useState(mottagningStart[user.kår]);
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

  return {
    currentDate,
    setCurrentDate,
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
    bookings,
    deletedBooking,
    updatedBooking,
    activePlans,
    user,
  };
};
