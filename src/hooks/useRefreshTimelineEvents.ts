import { useEffect, useRef } from "react";
import { useAllPlans } from "./useAllPlans";
import { useTimelineEvents } from "./useTimelineEvents";

export const useRefreshTimelineEvents = () => {
  const { setTimelineEvents } = useTimelineEvents();
  const { plansMap } = useAllPlans();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    const hasPlansLoaded = Object.keys(plansMap).length > 0;
    if (!hasPlansLoaded) return;

    if (hasRefreshed.current) return;

    setTimelineEvents((currentEvents) => {
      // No events to refresh
      if (currentEvents.length === 0) return currentEvents;

      return currentEvents.map((event) => {
        const plan = plansMap[event.planId];
        if (!plan) return event;

        const updatedEvent = plan.events.find((e) => e.id === event.id);
        return updatedEvent ?? event;
      });
    });

    hasRefreshed.current = true;
  }, [plansMap, setTimelineEvents]);
};
