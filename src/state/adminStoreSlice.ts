import { type Kår } from "@/utils/interfaces";
import { type StateCreator } from "zustand";
import { type PlanStoreSlice } from "./planStoreSlice";
import { setWeek, startOfWeek } from "date-fns";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";

interface AdminStoreSlice {
  planEditLocked: boolean;
  mottagningStart: Record<Kår, Date>;
  bookableItems: Record<string, number>;

  setPlanEditLock: (value: boolean) => void;
  setMottagningStart: (date: Date, kår: Kår) => void;
  setAdminSettings: (settings: {
    lockPlans: boolean;
    mottagningStart: Record<Kår, Date>;
    bookableItems: Record<string, number>;
  }) => void;
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
  bookableItems: {
    grillar: 8,
    bardiskar: 6,
  },

  setPlanEditLock: (value) => set(() => ({ planEditLocked: value })),
  setMottagningStart: (date, kår) => {
    set({
      mottagningStart: {
        ...get().mottagningStart,
        [kår]: date,
      },
    });
  },
  setAdminSettings: (settings) =>
    set(() => ({
      planEditLocked: settings.lockPlans,
      mottagningStart: settings.mottagningStart,
      bookableItems: settings.bookableItems,
    })),
});

export { createAdminStoreSlice };
export type { AdminStoreSlice };
