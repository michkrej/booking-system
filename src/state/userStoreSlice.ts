import { type User } from "@/utils/interfaces";
import { type StateCreator } from "zustand";
import { type PlanStoreSlice } from "./planStoreSlice";

interface UserStoreSlice {
  user: User | null;

  userUpdated: (user: User | null) => void;
}

const createUserStoreSlice: StateCreator<
  UserStoreSlice & PlanStoreSlice,
  [],
  [],
  UserStoreSlice
> = (set) => ({
  user: null,

  userUpdated: (user) => set({ user }),
});

export { createUserStoreSlice };
export type { UserStoreSlice };
