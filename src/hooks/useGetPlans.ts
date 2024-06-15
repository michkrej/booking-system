import { useEffect, useState } from 'react'

import { plansService } from '@/services'
import { usePlanActions, useUser } from '@/state/store'

export const useGetPlans = () => {
  const [isPending, setIsPending] = useState(false)
  const { publicPlansLoaded, userPlansLoaded } = usePlanActions()
  const { user } = useUser()

  const getPublicAndUserPlans = async (year: number) => {
    setIsPending(true)
    try {
      plansService.getAllPlans(user, year).then(({ publicPlans, userPlans }) => {
        publicPlansLoaded(publicPlans)
        userPlansLoaded(userPlans)
      })
    } catch (e) {
      // do something
    }
    setIsPending(false)
  }

  const getUserPlans = async (year: number) => {
    setIsPending(true)
    const plans = await plansService.getUserPlans(user, year)
    userPlansLoaded(plans)
    setIsPending(false)
  }

  const getPublicPlans = (year: number) => {
    setIsPending(true)
    plansService
      .getPublicPlans(user, year)
      .then((plans) => {
        publicPlansLoaded(plans)
      })
      .catch((e) => {
        // do something
      })
      .finally(() => {
        setIsPending(false)
      })
  }

  return { isPending, getUserPlans, getPublicAndUserPlans, getPublicPlans }
}
