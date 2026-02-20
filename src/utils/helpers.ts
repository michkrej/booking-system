import { differenceInMilliseconds, format } from "date-fns";
import { sv } from "date-fns/locale";
import { locationsValla } from "@/data/campusValla/campusValla";
import { committees, committeesConsensus, kårer } from "../data/committees";
import { campuses, locationsNonGrouped, rooms } from "../data/locationsData";
import { type Booking, type Kår, type Plan } from "../interfaces/interfaces";
import { BOOKABLE_ITEM_OPTIONS, viewCollisionsPath } from "./constants";
import { findInventoryCollisionsBetweenEvents } from "./inventoryCollisions";
import { findRoomCollisionsBetweenEvents } from "./roomCollisions";

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

export const getWeeksLeftToNolleP = (startDate: Date) => {
  const now = new Date();
  const diff = differenceInMilliseconds(startDate, now);
  const weeks = Math.round(diff / (1000 * 60 * 60 * 24 * 7));
  return weeks;
};

export const getTotalWeeksToNolleP = (startDate: Date) => {
  const endDate = new Date(`${new Date().getFullYear() - 1}-08-31`);
  const diff = differenceInMilliseconds(startDate, endDate);
  const weeks = Math.round(diff / (1000 * 60 * 60 * 24 * 7));
  return weeks;
};

export const getPercentageProgress = (startDate: Date) => {
  const weeksToNolleP = getWeeksLeftToNolleP(startDate);
  const totalWeeksToNolleP = getTotalWeeksToNolleP(startDate);
  const progress = Math.round(
    ((totalWeeksToNolleP - weeksToNolleP) / totalWeeksToNolleP) * 100,
  );
  return progress;
};

export const findCollisionsBetweenUserAndPublicPlans = (
  userPlan: Plan,
  publicPlans: Plan[],
) => {
  const allCollisions: {
    roomCollisions: Record<string, Plan["events"]>;
    inventoryCollisions: Record<string, Booking[]>;
  } = {
    roomCollisions: {},
    inventoryCollisions: {},
  };

  publicPlans.forEach((plan) => {
    const roomCollisions = findRoomCollisionsBetweenEvents([
      ...userPlan.events,
      ...plan.events,
    ]);

    const inventoryCollisions = findInventoryCollisionsBetweenEvents([
      ...userPlan.events,
      ...plan.events,
    ]);

    const collisionsWithUserPlan = inventoryCollisions.collisions.some(
      (booking) => booking.planId === userPlan.id,
    );

    allCollisions.roomCollisions[plan.id] = roomCollisions;

    allCollisions.inventoryCollisions[plan.id] = collisionsWithUserPlan
      ? inventoryCollisions.collisions
      : [];
  });

  return allCollisions;
};

export const isRoomCollisionView = (string: string) =>
  string.includes(viewCollisionsPath);

export const isInventoryCollisionView = (string: string) =>
  string.includes("inventory");
