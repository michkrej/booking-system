import { Kår, type Plan } from "@/utils/interfaces";
import { type StateCreator } from "zustand";
import { type UserStoreSlice } from "./userStoreSlice";
import { convertToDate } from "@/lib/utils";
import { setWeek, startOfWeek } from "date-fns";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";

export const MIN_YEAR = 2023;
export const MAX_YEAR = CURRENT_YEAR + 1;

interface PlanStoreSlice {
  planYear: number;
  userPlans: Plan[];
  publicPlans: Plan[];
  hasPublicPlan: boolean;
  collisionsExist: boolean;
  mottagningStart: Record<Kår, Date>;

  userPlansLoaded: (plans: Plan[]) => void;
  publicPlansLoaded: (plans: Plan[]) => void;
  userPlanDeleted: (planId: string) => void;
  userPlanUpdated: (plan: Partial<Plan>) => void;
  userPlanCreated: (plan: Plan) => void;
  incrementPlanYear: () => void;
  decrementPlanYear: () => void;
  planPublicToggled: (planId: string) => void;
  toggleCollisionsExist: () => void;
  setMottagningStart: (date: Date, kår: Kår) => void;
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

const createPlanStoreSlice: StateCreator<
  PlanStoreSlice & UserStoreSlice,
  [],
  [],
  PlanStoreSlice
> = (set, get) => ({
  planYear: CURRENT_YEAR,
  mottagningStart: {
    Consensus: getMottagningStartWeek(),
    StuFF: getMottagningStartWeek(),
    LinTek: getMottagningStartWeek(),
    Övrigt: getMottagningStartWeek(),
  },
  userPlans: [],
  publicPlans: [],
  hasPublicPlan: false,
  collisionsExist: false,

  userPlansLoaded: (plans) => {
    const sortedPlans = plans.sort((a, b) => {
      const aTime = convertToDate(a.updatedAt).getTime();
      const bTime = convertToDate(b.updatedAt).getTime();

      return bTime - aTime;
    });

    set({ hasPublicPlan: sortedPlans.some((plan) => plan.public) });
    set({ userPlans: sortedPlans });
  },
  publicPlansLoaded: (plans) => set({ publicPlans: plans }),
  userPlanDeleted: (planId) => {
    const plans = get().userPlans.filter((plan) => {
      return plan.id !== planId;
    });
    set({ userPlans: plans });
  },
  userPlanUpdated: (plan) => {
    const plans = get().userPlans.map((p) => {
      if (p.id === plan.id) {
        return {
          ...p,
          ...plan,
        };
      }
      return p;
    });
    set({ userPlans: plans });
  },
  userPlanCreated: (plan) => {
    set({ userPlans: [plan, ...get().userPlans] });
  },
  incrementPlanYear: () =>
    set((state) => {
      const newYear = state.planYear + 1;
      if (newYear >= MIN_YEAR && newYear <= MAX_YEAR) {
        return {
          planYear: newYear,
        };
      }
      throw new Error("Year out of bounds");
    }),
  decrementPlanYear: () =>
    set((state) => {
      const newYear = state.planYear - 1;
      console.log(newYear);
      if (newYear >= MIN_YEAR && newYear <= MAX_YEAR) {
        return {
          planYear: newYear,
        };
      }
      throw new Error("Year out of bounds");
    }),
  planPublicToggled: (planId) => {
    const plans = get().userPlans.map((plan) => {
      if (plan.id === planId) {
        set({ hasPublicPlan: !plan.public });
        return { ...plan, public: !plan.public };
      }
      return plan;
    });
    set({ userPlans: plans });
  },
  toggleCollisionsExist: () => {
    set((state) => ({ collisionsExist: !state.collisionsExist }));
  },
  setMottagningStart: (date, kår) => {
    set({
      mottagningStart: {
        ...get().mottagningStart,
        [kår]: date,
      },
    });
  },
});

export { createPlanStoreSlice };
export type { PlanStoreSlice };
