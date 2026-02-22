import { useState } from "react";
import {
  type Booking,
  type Location,
  type NewBooking,
} from "@/interfaces/interfaces";
import { type View } from "@/pages/Booking/components/ScheduleToolbar";
import { defaultCampus } from "@/utils/helpers";
import { useStoreUser } from "./useStoreUser";
import { useTimelineEvents } from "./useTimelineEvents";

export const useBookingState = () => {
  const { user } = useStoreUser();
  const { timelineEvents: bookings } = useTimelineEvents();

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
    user,
    bookings,
  };
};
