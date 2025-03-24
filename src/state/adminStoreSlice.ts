import {
  type NumericBookableKeys,
  type AdminSettings,
  type Kår,
} from "@/utils/interfaces";
import { type StateCreator } from "zustand";
import { type PlanStoreSlice } from "./planStoreSlice";
import { setISOWeek, startOfWeek } from "date-fns";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";

export const DEFAULT_ITEMS: Record<NumericBookableKeys, number> = {
  grillar: 8,
  bardiskar: 6,
  "bankset-hg": 20,
  "bankset-k": 25,
  "bankset-hoben": 50,
};

interface AdminStoreSlice {
  planEditLocked: Record<Kår, boolean>;
  mottagningStart: Record<Kår, Date>;
  bookableItems: Record<NumericBookableKeys, number>;

  updatedPlanEditLock: (value: boolean, kår: Kår) => void;
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
> = (set) => ({
  planEditLocked: {
    Consensus: false,
    StuFF: false,
    LinTek: false,
    Övrigt: false,
  },
  mottagningStart: {
    Consensus: getMottagningStartWeek(),
    StuFF: getMottagningStartWeek(),
    LinTek: getMottagningStartWeek(),
    Övrigt: getMottagningStartWeek(),
  },
  bookableItems: DEFAULT_ITEMS,

  updatedPlanEditLock: (value, kår) =>
    set((prev) => ({
      planEditLocked: {
        ...prev.planEditLocked,
        [kår]: value,
      },
    })),
  updatedMottagningStartDateForKår: (date, kår) => {
    set((prev) => ({
      mottagningStart: {
        ...prev.mottagningStart,
        [kår]: date,
      },
    }));
  },
  updatedBookableItems: (items) => set(() => ({ bookableItems: items })),
  loadedAdminSettings: (settings) => set(() => settings),
});

export { createAdminStoreSlice };
export type { AdminStoreSlice };
