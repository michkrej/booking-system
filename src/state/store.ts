import type {} from "@redux-devtools/extension"; // required for devtools typing
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { committees } from "@/data/committees";
import { createPlanStoreSlice, type PlanStoreSlice } from "./planStoreSlice";
import { createUserStoreSlice, type UserStoreSlice } from "./userStoreSlice";
import { type AdminStoreSlice, createAdminStoreSlice } from "./adminStoreSlice";
import {
  type BookingStoreSlice,
  createBookingStoreSlice,
} from "./bookingStoreSlice";

const useBoundStore = create<
  UserStoreSlice & PlanStoreSlice & AdminStoreSlice & BookingStoreSlice
>()(
  devtools(
    persist(
      (...a) => {
        return {
          ...createUserStoreSlice(...a),
          ...createPlanStoreSlice(...a),
          ...createAdminStoreSlice(...a),
          ...createBookingStoreSlice(...a),
        };
      },
      { name: "app-storage" },
    ),
  ),
);

export const useUser = () => {
  const user = useBoundStore((state) => state.user);

  if (!user) {
    throw new Error("User not found");
  }

  const kår = committees[user.committeeId].kår;

  return {
    user: {
      ...user,
      kår,
    },
  };
};

export const useUserUpdated = () => {
  return { userUpdated: useBoundStore((state) => state.userUpdated) };
};

export const useHasUser = () => {
  const user = useBoundStore((state) => state.user);

  return user !== null;
};

export const usePlanEditLock = () => {
  const setPlanEditLock = useBoundStore((state) => state.setPlanEditLock);

  return {
    planEditLocked: useBoundStore((state) => state.planEditLocked),
    setPlanEditLock,
  };
};

export const useUserPlans = () => {
  return useBoundStore((state) => state.userPlans) ?? [];
};

export const usePublicPlans = () => {
  return useBoundStore((state) => state.publicPlans) ?? [];
};

export const useNonUserPublicPlans = () => {
  const publicPlans = useBoundStore((state) => state.publicPlans) ?? [];
  const user = useBoundStore((state) => state.user);

  if (!user) {
    return [];
  }

  return publicPlans.filter((plan) => plan.userId !== user.id);
};

export const usePlanActions = () => {
  const userPlansLoaded = useBoundStore((state) => state.userPlansLoaded);
  const publicPlansLoaded = useBoundStore((state) => state.publicPlansLoaded);
  const userPlanDeleted = useBoundStore((state) => state.userPlanDeleted);
  const userPlanUpdated = useBoundStore((state) => state.userPlanUpdated);
  const userPlanCreated = useBoundStore((state) => state.userPlanCreated);
  const userPlanPublicToggled = useBoundStore(
    (state) => state.planPublicToggled,
  );

  return {
    userPlansLoaded,
    publicPlansLoaded,
    userPlanDeleted,
    userPlanUpdated,
    userPlanCreated,
    userPlanPublicToggled,
  };
};

export const usePlanYear = () => {
  return {
    planYear: useBoundStore((state) => state.planYear),
  };
};

export const usePlanYearActions = () => {
  const incrementPlanYear = useBoundStore((state) => state.incrementPlanYear);
  const decrementPlanYear = useBoundStore((state) => state.decrementPlanYear);
  const setMottagningStart = useBoundStore((state) => state.setMottagningStart);

  return { incrementPlanYear, decrementPlanYear, setMottagningStart };
};

export const useHasPublicPlan = () => {
  return useBoundStore((state) => state.hasPublicPlan);
};

export const useCollisionsExist = () => {
  const collisionsExist = useBoundStore((state) => state.collisionsExist);
  const toggleCollisionsExist = useBoundStore(
    (state) => state.toggleCollisionsExist,
  );

  return { collisionsExist, toggleCollisionsExist };
};

export const useMottagningStart = () => {
  return {
    mottagningStart: useBoundStore((state) => state.mottagningStart),
    setMottagningStart: useBoundStore((state) => state.setMottagningStart),
  };
};

export const useSetAdminSettings = () => {
  const setAdminSettings = useBoundStore((state) => state.setAdminSettings);

  return setAdminSettings;
};

export const useBookings = () => {
  const bookings = useBoundStore((state) => state.bookings);

  return {
    bookings,
    createBooking: useBoundStore((state) => state.createBooking),
    deleteBooking: useBoundStore((state) => state.deleteBooking),
    updateBooking: useBoundStore((state) => state.updateBooking),
    setInitialBookings: useBoundStore((state) => state.setInitialBookings),
  };
};
