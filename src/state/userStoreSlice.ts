import { type User } from "@/utils/interfaces";
import { type StateCreator } from "zustand";
import { type PlanStoreSlice } from "./planStoreSlice";

interface UserStoreSlice {
  user: User | null;
  versionUpdateWarningClosed: boolean;

  userUpdated: (user: User | null) => void;
  closeVersionUpdateWarning: () => void;
}

const createUserStoreSlice: StateCreator<
  UserStoreSlice & PlanStoreSlice,
  [],
  [],
  UserStoreSlice
> = (set) => ({
  user: null,
  versionUpdateWarningClosed: false,

  userUpdated: (user) => set({ user }),
  closeVersionUpdateWarning: () => set({ versionUpdateWarningClosed: true }),
});

export { createUserStoreSlice };
export type { UserStoreSlice };
