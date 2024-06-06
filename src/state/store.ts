import { create, StoreApi, UseBoundStore } from 'zustand'
import { Plan, User } from '../utils/interfaces'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

interface StoreState {
  user: User | null
  userPlans: Plan[] | null
  publicPlans: Plan[] | null
  planEditLocked: boolean
  authFinished: boolean
  updateUser: (user: User | null) => void
  updateUserPlans: (userPlans: Plan[]) => void
  updatePublicPlans: (publicPlans: Plan[]) => void
  updatePlanLock: (newValue: boolean) => void
  setAuthFinished: () => void
}

const useAppStoreBase = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        userPlans: null,
        publicPlans: null,
        planEditLocked: false,
        authFinished: false,

        updateUser: (user) => set({ user }),
        updateUserPlans: (userPlans) => set({ userPlans }),
        updatePublicPlans: (publicPlans) => set({ publicPlans }),
        updatePlanLock: (newValue) => set({ planEditLocked: newValue }),
        setAuthFinished: () => set({ authFinished: true })
      }),
      {
        name: 'app-storage'
      }
    )
  )
)

const useAppStore = createSelectors(useAppStoreBase)

const useUser = () => {
  const user = useAppStore.use.user()

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

const useHasUser = () => {
  return useAppStore.use.user() !== null
}

const useUpdateUser = () => {
  return useAppStore.use.updateUser()
}

export { useAppStore, useUser, useHasUser, useUpdateUser }
