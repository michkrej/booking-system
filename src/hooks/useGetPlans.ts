import { useEffect, useState } from 'react'

import { plansService } from '@/services'
import { usePlanActions, useUser } from '@/state/store'

export const useGetPlans = (year: number) => {
  const [isPending, setIsPending] = useState(false)
  const { publicPlansLoaded, userPlansLoaded } = usePlanActions()
  const { user } = useUser()

  const getPlans = async () => {
    setIsPending(true)
    try {
      const { userPlans, publicPlans } = await plansService.getAllPlans(user, year)
      publicPlansLoaded(publicPlans)
      userPlansLoaded(userPlans)
    } catch (e) {
      // do something
    }
    setIsPending(false)
  }

  const getUserPlans = async () => {
    setIsPending(true)
    const plans = await plansService.getUserPlans(user, year)
    userPlansLoaded(plans)
    setIsPending(false)
  }

  useEffect(() => {
    getPlans()
  }, [year])

  return { isPending, getUserPlans }
}
