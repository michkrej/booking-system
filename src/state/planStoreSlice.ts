import { type StateCreator } from "zustand";
import { type Plan } from "@/interfaces/interfaces";
import { CURRENT_YEAR } from "@/utils/constants";
import { findInventoryCollisionsBetweenEvents } from "@/utils/inventoryCollisions";
import { findRoomCollisionsBetweenEvents } from "@/utils/roomCollisions";
import { convertToDate } from "@/utils/utils";
import { type BookingStoreSlice } from "./bookingStoreSlice";
import { type UserStoreSlice } from "./userStoreSlice";

export const MIN_YEAR = 2025;
export const MAX_YEAR = CURRENT_YEAR + 1;

interface PlanStoreSlice {
  planYear: number;
  userPlans: Plan[];
  publicPlans: Plan[];
  hasPublicPlan: boolean;
  activePlans: Plan[];
  currentDate: Date;
  selectedUserPlan: Plan | undefined;

  userPlansLoaded: (plans: Plan[]) => void;
  publicPlansLoaded: (plans: Plan[]) => void;
  userPlanDeleted: (planId: string) => void;
  userPlanUpdated: (plan: Partial<Plan>) => void;
  userPlanCreated: (plan: Plan) => void;
  incrementPlanYear: () => void;
  decrementPlanYear: () => void;
  planPublicToggled: (planId: string) => void;
  changedActivePlans: (plans: Plan[]) => void;
  updatedActivePlans: ({
    plans,
    isCollisionView,
    isInventoryView,
  }: {
    plans: Plan[];
    isCollisionView?: boolean;
    isInventoryView?: boolean;
  }) => void;
  updatedCurrentDate: (date: Date) => void;
  setSelectedUserPlan: (plan: Plan | undefined) => void;
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
  selectedUserPlan: undefined,

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
  updatedActivePlans: ({ plans, isCollisionView, isInventoryView }) => {
    set((state) => {
      const updatedPlans = state.activePlans.map((plan) => {
        const updatedPlan = plans.find((p) => p.id === plan.id);
        if (!updatedPlan) return plan;
        return updatedPlan;
      });

      let bookings = updatedPlans.flatMap((plan) => plan.events);
      if (isCollisionView) {
        bookings = isInventoryView
          ? findInventoryCollisionsBetweenEvents(bookings).collisions
          : findRoomCollisionsBetweenEvents(bookings);
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
  setSelectedUserPlan: (plan) => {
    set({ selectedUserPlan: plan });
  },
});

export { createPlanStoreSlice };
export type { PlanStoreSlice };
