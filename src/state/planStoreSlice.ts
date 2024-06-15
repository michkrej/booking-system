import { Plan } from '@/utils/interfaces'
import { StateCreator } from 'zustand'
import { UserStoreSlice } from './userStoreSlice'
import { convertToDate } from '@/lib/utils'

export const MIN_YEAR = 2023
export const MAX_YEAR = new Date().getFullYear() + 1

interface PlanStoreSlice {
  planYear: number
  userPlans: Plan[]
  publicPlans: Plan[]
  hasPublicPlan: boolean
  collisionsExist: boolean

  userPlansLoaded: (plans: Plan[]) => void
  publicPlansLoaded: (plans: Plan[]) => void
  userPlanDeleted: (planId: string) => void
  userPlanUpdated: (plan: Partial<Plan>) => void
  userPlanCreated: (plan: Plan) => void
  incrementPlanYear: () => void
  decrementPlanYear: () => void
  planPublicToggled: (planId: string) => void
  toggleCollisionsExist: () => void
}

const createPlanStoreSlice: StateCreator<
  PlanStoreSlice & UserStoreSlice,
  [],
  [],
  PlanStoreSlice
> = (set, get) => ({
  planYear: new Date().getFullYear(),
  userPlans: [],
  publicPlans: [],
  hasPublicPlan: false,
  collisionsExist: false,

  userPlansLoaded: (plans) => {
    const sortedPlans = plans.sort((a, b) => {
      const aTime = convertToDate(a.updatedAt).getTime()
      const bTime = convertToDate(b.updatedAt).getTime()

      return bTime - aTime
    })

    set({ hasPublicPlan: sortedPlans.some((plan) => plan.public) })
    set({ userPlans: sortedPlans })
  },
  publicPlansLoaded: (plans) => set({ publicPlans: plans }),
  userPlanDeleted: (planId) => {
    const plans = get().userPlans.filter((plan) => {
      return plan.id !== planId
    })
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
    set({ userPlans: [plan, ...get().userPlans] })
  },
  incrementPlanYear: () =>
    set((state) => {
      const newYear = state.planYear + 1
      if (newYear >= MIN_YEAR && newYear <= MAX_YEAR) {
        return { planYear: newYear }
      }
      throw new Error('Year out of bounds')
    }),
  decrementPlanYear: () =>
    set((state) => {
      const newYear = state.planYear - 1
      if (newYear >= MIN_YEAR && newYear <= MAX_YEAR) {
        return { planYear: newYear }
      }
      throw new Error('Year out of bounds')
    }),
  planPublicToggled: (planId) => {
    const plans = get().userPlans.map((plan) => {
      if (plan.id === planId) {
        set({ hasPublicPlan: !plan.public })
        return { ...plan, public: !plan.public }
      }
      return plan
    })
    set({ userPlans: plans })
  },
  toggleCollisionsExist: () => {
    set((state) => ({ collisionsExist: !state.collisionsExist }))
  }
})

export { createPlanStoreSlice }
export type { PlanStoreSlice }
