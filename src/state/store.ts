import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing

import { createUserStoreSlice, UserStoreSlice } from './userStoreSlice'
import { createPlanStoreSlice, PlanStoreSlice } from './planStoreSlice'

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
