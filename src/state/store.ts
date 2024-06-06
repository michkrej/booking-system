import { create } from 'zustand'
import { Plan, User } from '../utils/interfaces'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing

interface StoreState {
  user: User | null
  userPlans: Plan[]
  publicPlans: Plan[]
  planEditLocked: boolean

  userUpdated: (user: User | null) => void
  changedPlanEditLock: (newValue: boolean) => void
  userPlansLoaded: (plans: Plan[]) => void
  publicPlansLoaded: (plans: Plan[]) => void
  userPlanDeleted: (planId: string) => void
  userPlanUpdated: (plan: Partial<Plan>) => void
  userPlanCreated: (plan: Plan) => void
}

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        userPlans: [],
        publicPlans: [],
        planEditLocked: false,

        changedPlanEditLock: (newValue) => set({ planEditLocked: newValue }),
        userUpdated: (user) => set({ user }),
        userPlansLoaded: (plans) => set({ userPlans: plans }),
        publicPlansLoaded: (plans) => set({ publicPlans: plans }),
        userPlanDeleted: (planId) => {
          const plans = get().userPlans.filter((plan) => plan.id !== planId)
          set({ userPlans: plans })
        },
        userPlanUpdated: (plan) => {
          const plans = get().userPlans.map((p) => {
            if (p.id === plan.id) {
              return {
                ...p,
                ...plan
              }
            }
            return p
          })
          set({ userPlans: plans })
        },
        userPlanCreated: (plan) => {
          set({ userPlans: [...get().userPlans, plan] })
        }
      }),
      {
        name: 'app-storage'
      }
    )
  )
)

export const useUser = () => {
  const user = useStore((state) => state.user)

  if (!user) {
    throw new Error('User not found')
  }

  return { user }
}

export const useUserUpdated = () => {
  const userUpdated = useStore((state) => state.userUpdated)

  return { userUpdated }
}

export const useHasUser = () => {
  return useStore((state) => state.user !== null)
}

export const usePlanEditLock = () => {
  const changedPlanEditLock = useStore((state) => state.changedPlanEditLock)
  const planEditLocked = useStore((state) => state.planEditLocked)

  return { planEditLocked, changedPlanEditLock }
}

export const useUserPlans = () => {
  const userPlans = useStore((state) => state.userPlans)

  return userPlans ?? []
}

export const usePublicPlans = () => {
  const publicPlans = useStore((state) => state.publicPlans)

  return publicPlans ?? []
}

export const usePlanActions = () => {
  const userPlansLoaded = useStore((state) => state.userPlansLoaded)
  const publicPlansLoaded = useStore((state) => state.publicPlansLoaded)
  const userPlanDeleted = useStore((state) => state.userPlanDeleted)
  const userPlanUpdated = useStore((state) => state.userPlanUpdated)
  const userPlanCreated = useStore((state) => state.userPlanCreated)

  return {
    userPlansLoaded,
    publicPlansLoaded,
    userPlanDeleted,
    userPlanUpdated,
    userPlanCreated
  }
}
