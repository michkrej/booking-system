import type {} from "@redux-devtools/extension"; // required for devtools typing
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createPlanStoreSlice, type PlanStoreSlice } from "./planStoreSlice";
import { createUserStoreSlice, type UserStoreSlice } from "./userStoreSlice";
import { type AdminStoreSlice, createAdminStoreSlice } from "./adminStoreSlice";
import {
  type BookingStoreSlice,
  createBookingStoreSlice,
} from "./bookingStoreSlice";

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
      { name: "app-storage" },
    ),
  ),
);
