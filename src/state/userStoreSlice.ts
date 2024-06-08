import { User } from '@/utils/interfaces'
import { StateCreator } from 'zustand'
import { PlanStoreSlice } from './planStoreSlice'

interface UserStoreSlice {
  user: User | null
  planEditLocked: boolean

  userUpdated: (user: User | null) => void
  changedPlanEditLock: () => void
}

const createUserStoreSlice: StateCreator<
  UserStoreSlice & PlanStoreSlice,
  [],
  [],
  UserStoreSlice
> = (set) => ({
  user: null,
  planEditLocked: false,

  changedPlanEditLock: () => set((state) => ({ planEditLocked: !state.planEditLocked })),
  userUpdated: (user) => set({ user })
})

export { createUserStoreSlice }
export type { UserStoreSlice }
