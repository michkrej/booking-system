import { type AdminSettings, type Kår } from "@/utils/interfaces";
import { type StateCreator } from "zustand";
import { type PlanStoreSlice } from "./planStoreSlice";
import { setISOWeek, startOfWeek } from "date-fns";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";

export const DEFAULT_ITEMS = {
  grillar: 8,
  bardiskar: 6,
  scenes: 10,
  "bankset-hg": 20,
  "bankset-k": 25,
  "bankset-hoben": 50,
  "ff-trailer": 1,
  "ff-tents": 4,
  "ff-elverk": 1,
} as const;

interface AdminStoreSlice {
  planEditLocked: boolean;
  mottagningStart: Record<Kår, Date>;
  bookableItems: Record<string, number>;

  updatedPlanEditLock: (value: boolean) => void;
  updatedMottagningStartDateForKår: (date: Date, kår: Kår) => void;
  updatedBookableItems: (items: Record<string, number>) => void;
  loadedAdminSettings: (settings: AdminSettings) => void;
}

const getMottagningStartWeek = () => {
  const firstDayOfWeek34 = startOfWeek(
    setISOWeek(new Date(CURRENT_YEAR, 0, 1), 34),
    {
      weekStartsOn: 2,
    },
  );

  return new Date(firstDayOfWeek34);
};

const createAdminStoreSlice: StateCreator<
  AdminStoreSlice & PlanStoreSlice,
  [],
  [],
  AdminStoreSlice
> = (set, get) => ({
  planEditLocked: false,
  mottagningStart: {
    Consensus: getMottagningStartWeek(),
    StuFF: getMottagningStartWeek(),
    LinTek: getMottagningStartWeek(),
    Övrigt: getMottagningStartWeek(),
  },
  bookableItems: DEFAULT_ITEMS,

  updatedPlanEditLock: (value) => set(() => ({ planEditLocked: value })),
  updatedMottagningStartDateForKår: (date, kår) => {
    set({
      mottagningStart: {
        ...get().mottagningStart,
        [kår]: date,
      },
    });
  },
  updatedBookableItems: (items) => set(() => ({ bookableItems: items })),
  loadedAdminSettings: (settings) => set(() => settings),
});

export { createAdminStoreSlice };
export type { AdminStoreSlice };
