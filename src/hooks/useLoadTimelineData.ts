import { useNavigate } from "react-router-dom";
import type { Plan } from "@/interfaces/interfaces";
import {
  type CollisionDisplayRow,
  getEventsFromCollisionDisplayRows,
} from "@/utils/collision/collisionComputation";
import { viewCollisionsPath } from "@/utils/constants";
import { useTimelineDate } from "./useTimelineDate";
import { useTimelineEvents } from "./useTimelineEvents";

export const useLoadTimelineData = () => {
  const { setTimelineEvents } = useTimelineEvents();
  const { resetTimelineDate, setTimelineDate } = useTimelineDate();
  const navigate = useNavigate();

  const handlePlanClick = (
    plan: Plan,
    mode: "edit" | "view",
    openInNewTab = false,
  ) => {
    const events = plan.events;

    const startDate = events[0]?.startDate;
    if (startDate) {
      setTimelineDate(startDate);
    } else {
      resetTimelineDate();
    }

    setTimelineEvents(events);

    const url = mode === "edit" ? `/booking/${plan.id}` : `/booking/view`;

    if (openInNewTab) {
      history.pushState({ plans: [plan], events }, "", url);
      window.open(url, "_blank");
    } else {
      navigate(url, { state: { plans: [plan], events } });
    }
  };

  const handleMultiplePlansClick = (plans: Plan[], openInNewTab = false) => {
    const events = plans.flatMap((plan) => plan.events);
    setTimelineEvents(events);

    const startDate = events[0]?.startDate;
    if (startDate) {
      setTimelineDate(startDate);
    } else {
      resetTimelineDate();
    }

    if (openInNewTab) {
      history.pushState({ plans, events }, "", `/booking/view`);
      window.open(`/booking/view`, "_blank");
    } else {
      navigate(`/booking/view`, { state: { plans, events } });
    }
  };

  const handleCollisionRowClick = (
    row: CollisionDisplayRow,
    openInNewTab = false,
  ) => {
    const plans: Plan[] = [row.plan1, row.plan2];

    const events = getEventsFromCollisionDisplayRows([row]);
    setTimelineEvents(events);

    const startDate = events[0]?.startDate;
    if (startDate) {
      setTimelineDate(startDate);
    } else {
      resetTimelineDate();
    }

    const path =
      row.type === "room"
        ? `/booking/${viewCollisionsPath}`
        : `/inventory/${viewCollisionsPath}`;
    if (openInNewTab) {
      history.pushState({ plans, events }, "", path);
      window.open(path, "_blank");
    } else {
      navigate(path, { state: { events, plans } });
    }
  };

  const handleViewAllCollisionsClick = (
    conflictRows: CollisionDisplayRow[],
    openInNewTab = false,
  ) => {
    const plans: Plan[] = Array.from(
      new Map(
        conflictRows
          .flatMap((row) => [row.plan1, row.plan2])
          .map((plan) => [plan.id, plan]),
      ).values(),
    );

    const events = getEventsFromCollisionDisplayRows(conflictRows);

    setTimelineEvents(events);

    const startDate = events[0]?.startDate;
    if (startDate) {
      setTimelineDate(startDate);
    } else {
      resetTimelineDate();
    }

    const hasRoomCollisions = conflictRows.some((conf) => conf.type === "room");

    const url = hasRoomCollisions
      ? `/booking/${viewCollisionsPath}`
      : `/inventory/${viewCollisionsPath}`;

    if (openInNewTab) {
      history.pushState({ plans, events }, "", url);
      window.open(url, "_blank");
    } else {
      navigate(url, { state: { events, plans } });
    }
  };

  return {
    handlePlanClick,
    handleMultiplePlansClick,
    handleCollisionRowClick,
    handleViewAllCollisionsClick,
  };
};
