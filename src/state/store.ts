import { create } from 'zustand'
import { Plan, User } from '../utils/interfaces'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
interface StoreState {
  user: User | null
  userPlans: Plan[] | null
  publicPlans: Plan[] | null
  planEditLocked: boolean

  actions: {
    userUpdated: (user: User | null) => void
    changedPlanEditLock: (newValue: boolean) => void
  }
}

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        userPlans: null,
        publicPlans: null,
        planEditLocked: false,

        actions: {
          userUpdated: (user) => set({ user }),
          changedPlanEditLock: (newValue) => set({ planEditLocked: newValue })
        }
      }),
      {
        name: 'app-storage'
      }
    )
  )
)

export const useStoreActions = () => useStore((state) => state.actions)

export const useUser = () => {
  const user = useStore((state) => state.user)
  const userUpdated = useStore((state) => state.actions.userUpdated)

  if (!user) {
    throw new Error('User not found')
  }

  return { user, userUpdated }
}

export const useHasUser = () => {
  return useStore((state) => state.user !== null)
}

export const usePlanEditLock = () => {
  const changedPlanEditLock = useStore((state) => state.actions.changedPlanEditLock)
  const planEditLocked = useStore((state) => state.planEditLocked)

  return { planEditLocked, changedPlanEditLock }
}
