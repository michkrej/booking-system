import { setISOWeek, startOfWeek } from "date-fns";
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { Booking, Kår, User } from "@/interfaces/interfaces";
import { CURRENT_YEAR } from "@/utils/constants";

const userAtom = atom<User | null>(null);

const numberStorage = createJSONStorage<number>(() => localStorage, {
  reviver: (_key, value) => {
    if (_key === "" && typeof value === "string") {
      return Number(value);
    }
    return value;
  },
});

const activeYearAtom = atomWithStorage<number>(
  "activeYear",
  CURRENT_YEAR,
  numberStorage,
  { getOnInit: true },
);

const getMottagningStartWeek = () => {
  const firstDayOfWeek34 = startOfWeek(
    setISOWeek(new Date(CURRENT_YEAR, 0, 1), 34),
    {
      weekStartsOn: 2,
    },
  );

  return new Date(firstDayOfWeek34);
};

const dateStorage = createJSONStorage<Date>(() => localStorage, {
  reviver: (_key, value) => {
    if (_key === "" && typeof value === "string") {
      return new Date(value);
    }
    return value;
  },
});

const timelineDateAtom = atomWithStorage<Date>(
  "timelineDate",
  getMottagningStartWeek(),
  dateStorage,
  { getOnInit: true },
);

const mottagningStartAtom = atom<Record<Kår, Date>>({
  Consensus: getMottagningStartWeek(),
  StuFF: getMottagningStartWeek(),
  LinTek: getMottagningStartWeek(),
  Övrigt: getMottagningStartWeek(),
});

const changelogAtom = atomWithStorage<string | null>("changelogVersion", null);

const appModeAtom = atomWithStorage<"user" | "spectator">("appMode", "user");

const timelineEventsAtom = atomWithStorage<Booking[]>(
  "timelineEvents",
  [],
  undefined,
  { getOnInit: true },
);

export {
  timelineDateAtom,
  activeYearAtom,
  timelineEventsAtom,
  userAtom,
  appModeAtom,
  changelogAtom,
  mottagningStartAtom,
};
