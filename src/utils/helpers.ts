import { format, setISOWeek, startOfWeek } from "date-fns";
import { sv } from "date-fns/locale";
import { locationsValla } from "@/data/campusValla/campusValla";
import { committees, committeesConsensus, kårer } from "../data/committees";
import { campuses, locationsNonGrouped, rooms } from "../data/locationsData";
import { type Booking, type Kår, type Plan } from "../interfaces/interfaces";
import {
  BOOKABLE_ITEM_OPTIONS,
  CURRENT_YEAR,
  viewCollisionsPath,
} from "./constants";

export const exportPlans = async (
  plans: Plan[],
  onlyBookableLocationValla: boolean,
  includeInventory: boolean,
) => {
  let events = plans.flatMap((plan) => plan.events);

  if (onlyBookableLocationValla) {
    events = events.filter(
      (event) => event.locationId === locationsValla["Områden på campus"].id,
    );
  }

  events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  return events.map((event) => {
    const committee = committees[event.committeeId];
    const location = locationsNonGrouped.find(
      (loc) => loc.id === event.locationId,
    );

    const roomNames = event.roomId
      .map((roomID) => rooms.find((room) => room.id === roomID)?.name)
      .filter(Boolean) // Remove undefined values
      .join(", ");

    const items = BOOKABLE_ITEM_OPTIONS.reduce(
      (acc, item) => {
        const bookableItem = (event?.bookableItems || []).find(
          (bookableItem) => bookableItem.key === item.key,
        );
        if (bookableItem) {
          acc[item.value] = bookableItem.value;
        } else {
          acc[item.value] = "";
        }
        return acc;
      },
      {} as Record<string, number | string>,
    );

    return {
      id: event.id,
      Fadderi: committee?.name,
      Aktivitet: event.title,
      Område: location?.name,
      Plats: roomNames,
      Startdatum: format(event.startDate, "yyyy-MM-dd", { locale: sv }),
      Starttid: format(event.startDate, "HH:mm", { locale: sv }),
      Slutdatum: format(event.endDate, "yyyy-MM-dd", { locale: sv }),
      Sluttid: format(event.endDate, "HH:mm", { locale: sv }),
      Mat: event.alcohol ? "Ja" : "Nej",
      Alkohol: event.food ? "Ja" : "Nej",
      ...(includeInventory ? items : {}),
      ...(onlyBookableLocationValla
        ? {}
        : { "Länk till plats": event.link || "" }),
    };
  });
};

export const getCommitteesForKår = (kår: Kår) => {
  return kårer[kår];
};

export const defaultCampus = (committeeId: string) => {
  if (Object.keys(committeesConsensus).includes(committeeId))
    return campuses.US;
  return campuses.Valla;
};

export const isRoomCollisionView = (string: string) =>
  string.includes(viewCollisionsPath);

export const isInventoryCollisionView = (string: string) =>
  string.includes("inventory");

export const updatePlansEventList = (
  plans: Plan[],
  booking: Booking,
  action: "add" | "remove" | "update",
) => {
  return plans.map((plan) => {
    if (plan.id !== booking.planId) return plan; // Skip plans that don't match

    let updatedEvents = plan.events;

    switch (action) {
      case "remove":
        updatedEvents = plan.events.filter((event) => event.id !== booking.id);
        break;
      case "update":
        updatedEvents = plan.events.map((event) =>
          event.id === booking.id ? booking : event,
        );
        break;
      case "add":
        updatedEvents = [...plan.events, booking];
        break;
    }

    return { ...plan, events: updatedEvents };
  });
};

export const getMottagningStartWeek = () => {
  const firstDayOfWeek34 = startOfWeek(
    setISOWeek(new Date(CURRENT_YEAR, 0, 1), 34),
    {
      weekStartsOn: 2,
    },
  );

  return new Date(firstDayOfWeek34);
};
