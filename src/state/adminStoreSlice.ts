import { type AdminSettings, type Kår } from "@/utils/interfaces";
import { type StateCreator } from "zustand";
import { type PlanStoreSlice } from "./planStoreSlice";
import { setWeek, startOfWeek } from "date-fns";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";

interface AdminStoreSlice {
  planEditLocked: boolean;
  mottagningStart: Record<Kår, Date>;
  bookableItems: Record<string, number> | null;

  updatedPlanEditLock: (value: boolean) => void;
  updatedMottagningStartDateForKår: (date: Date, kår: Kår) => void;
  updatedBookableItems: (items: Record<string, number>) => void;
  loadedAdminSettings: (settings: AdminSettings) => void;
}

const getMottagningStartWeek = () => {
  const firstDayOfWeek34 = startOfWeek(
    setWeek(new Date(CURRENT_YEAR, 0, 1), 34),
    {
      weekStartsOn: 1,
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
  bookableItems: null,

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
