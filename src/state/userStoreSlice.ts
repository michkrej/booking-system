import { type StateCreator } from "zustand";
import { type User } from "@/interfaces/interfaces";
import { type PlanStoreSlice } from "./planStoreSlice";

interface UserStoreSlice {
  user: User | null;
  versionUpdateWarningClosed: string;
  appMode: "user" | "spectator";

  userUpdated: (user: User | null) => void;
  closeVersionUpdateWarning: () => void;
  changedAppMode: (appMode: "user" | "spectator") => void;
}

export const CURRENT_APP_VERSION = "v3.6.1";

const createUserStoreSlice: StateCreator<
  UserStoreSlice & PlanStoreSlice,
  [],
  [],
  UserStoreSlice
> = (set) => ({
  user: null,
  versionUpdateWarningClosed: CURRENT_APP_VERSION,
  appMode: "user",

  userUpdated: (user) => set({ user }),
  closeVersionUpdateWarning: () =>
    set({ versionUpdateWarningClosed: CURRENT_APP_VERSION }),
  changedAppMode: (appMode) => set({ appMode }),
});

export { createUserStoreSlice };
export type { UserStoreSlice };
