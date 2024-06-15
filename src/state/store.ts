import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing

import { createUserStoreSlice, UserStoreSlice } from './userStoreSlice'
import { createPlanStoreSlice, PlanStoreSlice } from './planStoreSlice'
import { getCommittee } from '@/lib/utils'
import { Plan } from '@/utils/interfaces'

const useBoundStore = create<UserStoreSlice & PlanStoreSlice>()(
  devtools(
    persist(
      (...a) => {
        return {
          ...createUserStoreSlice(...a),
          ...createPlanStoreSlice(...a)
        }
      },
      { name: 'app-storage' }
    )
  )
)

export const useUser = () => {
  const user = useBoundStore((state) => state.user)

  if (!user) {
    throw new Error('User not found')
  }

  return { user }
}

export const useUserUpdated = () => {
  return { userUpdated: useBoundStore((state) => state.userUpdated) }
}

export const useHasUser = () => {
  const user = useBoundStore((state) => state.user)

  return user !== null
}

export const usePlanEditLock = () => {
  const changedPlanEditLock = useBoundStore((state) => state.changedPlanEditLock)
  const planEditLocked = useBoundStore((state) => state.planEditLocked)
  return { planEditLocked, changedPlanEditLock }
}

export const useUserPlans = () => {
  return useBoundStore((state) => state.userPlans) ?? []
}

export const usePublicPlans = () => {
  return useBoundStore((state) => state.publicPlans) ?? []
}

export const usePublicGroupedPlans = () => {
  const publicPlans = useBoundStore((state) => state.publicPlans) ?? []

  // group by committee
  const groupedPlans = publicPlans.reduce(
    (acc, plan) => {
      const committee = getCommittee(plan.committeeId)
      if (!committee || !committee.kår) {
        return acc
      }

      const kår = committee.kår
      const plans = acc[kår] || []
      plans.push(plan)
      acc[kår] = plans
      return acc
    },
    {} as Record<string, Plan[]>
  )

  return groupedPlans
}

export const useNonUserPublicPlans = () => {
  const publicPlans = useBoundStore((state) => state.publicPlans) ?? []
  const user = useBoundStore((state) => state.user)

  if (!user) {
    return []
  }

  return publicPlans.filter((plan) => plan.userId !== user.userId)
}

export const usePlanActions = () => {
  const userPlansLoaded = useBoundStore((state) => state.userPlansLoaded)
  const publicPlansLoaded = useBoundStore((state) => state.publicPlansLoaded)
  const userPlanDeleted = useBoundStore((state) => state.userPlanDeleted)
  const userPlanUpdated = useBoundStore((state) => state.userPlanUpdated)
  const userPlanCreated = useBoundStore((state) => state.userPlanCreated)
  const userPlanPublicToggled = useBoundStore((state) => state.planPublicToggled)

  return {
    userPlansLoaded,
    publicPlansLoaded,
    userPlanDeleted,
    userPlanUpdated,
    userPlanCreated,
    userPlanPublicToggled
  }
}

export const usePlanYear = () => {
  return useBoundStore((state) => state.planYear)
}

export const usePlanYearActions = () => {
  const incrementPlanYear = useBoundStore((state) => state.incrementPlanYear)
  const decrementPlanYear = useBoundStore((state) => state.decrementPlanYear)

  return { incrementPlanYear, decrementPlanYear }
}

export const useHasPublicPlan = () => {
  return useBoundStore((state) => state.hasPublicPlan)
}

export const useCollisionsExist = () => {
  const collisionsExist = useBoundStore((state) => state.collisionsExist)
  const toggleCollisionsExist = useBoundStore((state) => state.toggleCollisionsExist)

  return { collisionsExist, toggleCollisionsExist }
}
