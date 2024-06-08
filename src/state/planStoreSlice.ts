import { Plan } from '@/utils/interfaces'
import { StateCreator } from 'zustand'
import { UserStoreSlice } from './userStoreSlice'

interface PlanStoreSlice {
  userPlans: Plan[]
  publicPlans: Plan[]

  userPlansLoaded: (plans: Plan[]) => void
  publicPlansLoaded: (plans: Plan[]) => void
  userPlanDeleted: (planId: string) => void
  userPlanUpdated: (plan: Partial<Plan>) => void
  userPlanCreated: (plan: Plan) => void
}

const createPlanStoreSlice: StateCreator<
  PlanStoreSlice & UserStoreSlice,
  [],
  [],
  PlanStoreSlice
> = (set, get) => ({
  userPlans: [],
  publicPlans: [],

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
})

export { createPlanStoreSlice }
export type { PlanStoreSlice }
