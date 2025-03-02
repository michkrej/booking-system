import { campuses, locationsNonGrouped, rooms } from "../data/locationsData";
import { committees, committeesConsensus, kårer } from "../data/committees";
import { type Kår, type Booking, type Plan } from "./interfaces";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export const exportPlan = async (plans: Plan[]) => {
  const header = [
    "ID",
    "Fadderi",
    "Aktivitet",
    "Område",
    "Plats",
    "Startdatum",
    "Starttid",
    "Slutdatum",
    "Sluttid",
    "Alkohol",
    "Mat",
    "Bardiskar",
    "Bänkset Kårallen",
    "Bänkset HG",
    "Grillar",
    "Annat bokbart",
    "Beskrivining",
    "Länk",
  ];
  const events = plans.flatMap((plan) => plan.events);
  events.sort(
    (a, b) => a.startDate.getMilliseconds() - b.startDate.getMilliseconds(),
  );
  const cvsConversion = events.map((event) => {
    const committee = Object.values(committees).find(
      (com) => com.id === event.committeeId,
    );
    const location = locationsNonGrouped.find(
      (location) => location.id === event.locationId,
    );

    const roomValues = Object.values(rooms);
    const roomNames = event.roomId
      .map(
        (eventRoomID) =>
          roomValues.find((room) => room.id === eventRoomID)?.name,
      )
      .join(", ");
    return [
      event.id,
      committee?.name,
      event.title,
      location?.name,
      roomNames,
      format(event.startDate, "YYYY-MM-DD", { locale: sv }),
      format(event.startDate, "HH:mm", { locale: sv }),
      format(event.endDate, "YYYY-MM-DD", { locale: sv }),
      format(event.endDate, "HH:mm", { locale: sv }),
      /*  event.alcohol ? "TRUE" : "FALSE",
      event.food ? "TRUE" : "FALSE",
      event.bardiskar || "0",
      event["bankset-k"] || "0",
      event["bankset-hg"] || "0",
      event.grillar || "0",
      event.annat || "",
      event.description || "",
      event.link || "", */
    ];
  });
  return [header, ...cvsConversion];
};

export const getCommitteesForKår = (kår: Kår) => {
  return kårer[kår];
};

export const defaultCampus = (committeeId: string) => {
  if (Object.keys(committeesConsensus).includes(committeeId))
    return campuses.US;
  return campuses.Valla;
};

export const formatCollisions = (collisions: Booking[]) => {
  return `+${(collisions || []).map((collision) => collision.id).join("+")}`;
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getYears = () => {
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => i + startYear,
  );
  // Conditionally extend years with one year if the date is past october 1st
  if (new Date().getMonth() >= 9) {
    years.push(currentYear + 1);
  }
  return years;
};

export const getActiveYear = () => {
  // The year should be the current year if the date is past october 1st
  const currentYear = new Date().getFullYear();
  if (new Date().getMonth() >= 9) {
    return currentYear + 1;
  }
  return currentYear;
};
