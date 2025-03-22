import { type Plan } from "@/utils/interfaces";
import { type StateCreator } from "zustand";
import { type UserStoreSlice } from "./userStoreSlice";
import { convertToDate } from "@/lib/utils";
import { CURRENT_YEAR } from "@/utils/CONSTANTS";
import { type BookingStoreSlice } from "./bookingStoreSlice";
import { findRoomCollisionsBetweenEvents } from "@/utils/roomCollisions";

export const MIN_YEAR = 2025;
export const MAX_YEAR = CURRENT_YEAR + 1;

interface PlanStoreSlice {
  planYear: number;
  userPlans: Plan[];
  publicPlans: Plan[];
  hasPublicPlan: boolean;
  activePlans: Plan[];
  currentDate: Date;

  userPlansLoaded: (plans: Plan[]) => void;
  publicPlansLoaded: (plans: Plan[]) => void;
  userPlanDeleted: (planId: string) => void;
  userPlanUpdated: (plan: Partial<Plan>) => void;
  userPlanCreated: (plan: Plan) => void;
  incrementPlanYear: () => void;
  decrementPlanYear: () => void;
  planPublicToggled: (planId: string) => void;
  changedActivePlans: (plans: Plan[]) => void;
  updatedActivePlans: (plans: Plan[], isCollisionView?: boolean) => void;
  updatedCurrentDate: (date: Date) => void;
}

const createPlanStoreSlice: StateCreator<
  PlanStoreSlice & UserStoreSlice & BookingStoreSlice,
  [],
  [],
  PlanStoreSlice
> = (set, get) => ({
  planYear: CURRENT_YEAR,

  userPlans: [],
  publicPlans: [],
  hasPublicPlan: false,
  activePlans: [],
  currentDate: new Date(`${CURRENT_YEAR}-08-18`),

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
  changedActivePlans: (plans) => {
    set({ activePlans: plans });
  },
  updatedActivePlans: (plans, isCollisionView) => {
    set((state) => {
      const updatedPlans = state.activePlans.map((plan) => {
        const updatedPlan = plans.find((p) => p.id === plan.id);
        if (!updatedPlan) return plan;
        return updatedPlan;
      });

      let bookings = updatedPlans.flatMap((plan) => plan.events);
      if (isCollisionView) {
        bookings = findRoomCollisionsBetweenEvents(bookings);
      }

      return {
        activePlans: updatedPlans,
        bookings,
      };
    });
  },
  updatedCurrentDate: (date) => {
    set({ currentDate: date });
  },
});

export { createPlanStoreSlice };
export type { PlanStoreSlice };
