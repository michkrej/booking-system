import { useAtom } from "jotai";
import { useMemo } from "react";
import type { Booking } from "@/interfaces/interfaces";
import { timelineEventsAtom } from "@/state/atoms";
import { convertToDate } from "@/utils/utils";

const useTimelineEvents = () => {
  const [timelineEvents, setTimelineEvents] = useAtom(timelineEventsAtom);

  const addEvent = (booking: Booking) => {
    setTimelineEvents((prev) => [...prev, booking]);
  };

  const updateEvent = (booking: Booking) => {
    setTimelineEvents((prev) =>
      prev.map((b) => (b.id === booking.id ? booking : b)),
    );
  };

  const deleteEvent = (booking: Booking) => {
    setTimelineEvents((prev) => prev.filter((b) => b.id !== booking.id));
  };

  const sortedTimelineEvents = useMemo(() => {
    return timelineEvents.sort((a, b) => {
      const aTime = convertToDate(a.startDate).getTime();
      const bTime = convertToDate(b.startDate).getTime();
      return aTime - bTime;
    });
  }, [timelineEvents]);

  return {
    timelineEvents: sortedTimelineEvents,
    setTimelineEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};

export { useTimelineEvents };
