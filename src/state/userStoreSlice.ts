import { type User } from "@/utils/interfaces";
import { type StateCreator } from "zustand";
import { type PlanStoreSlice } from "./planStoreSlice";

interface UserStoreSlice {
  user: User | null;
  versionUpdateWarningClosed: string;

  userUpdated: (user: User | null) => void;
  closeVersionUpdateWarning: () => void;
}

export const CURRENT_APP_VERSION = "v3.1.0";

const createUserStoreSlice: StateCreator<
  UserStoreSlice & PlanStoreSlice,
  [],
  [],
  UserStoreSlice
> = (set) => ({
  user: null,
  versionUpdateWarningClosed: CURRENT_APP_VERSION,

  userUpdated: (user) => set({ user }),
  closeVersionUpdateWarning: () =>
    set({ versionUpdateWarningClosed: CURRENT_APP_VERSION }),
});

export { createUserStoreSlice };
export type { UserStoreSlice };
