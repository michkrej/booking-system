// required for devtools typing
import type {} from "@redux-devtools/extension";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type AdminStoreSlice, createAdminStoreSlice } from "./adminStoreSlice";
import {
  type BookingStoreSlice,
  createBookingStoreSlice,
} from "./bookingStoreSlice";
import { type PlanStoreSlice, createPlanStoreSlice } from "./planStoreSlice";
import { type UserStoreSlice, createUserStoreSlice } from "./userStoreSlice";

export const useBoundStore = create<
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
      {
        name: "app-storage",
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !["selectedUserPlan"].includes(key),
            ),
          ),
      },
    ),
  ),
);
