import { useEffect, useState } from 'react'
import usePlansContext from './context/usePlansContext'
import { useAdminSettings } from './useAdminSettings'
import { PlansService } from '../services/plans.service'
import { useUser } from '../state/store'

export const useGetPlans = (year: number) => {
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = usePlansContext()
  const { planEditLocked } = useAdminSettings()
  const { user } = useUser()

  const getPlans = async () => {
    setIsPending(true)
    try {
      const { plans: _plans, publicPlans } = await PlansService.getAllPlans(user, year)
      dispatch({
        type: 'LOAD',
        payload: { plans: _plans, publicPlans, admin: planEditLocked }
      })
    } catch (e) {
      // do something
    }
    setIsPending(false)
  }

  const getUserPlans = async () => {
    setIsPending(true)
    const plans = await PlansService.getUserPlans(user, year)
    dispatch({
      type: 'LOAD',
      payload: { plans, admin: planEditLocked }
    })
    setIsPending(false)
  }

  useEffect(() => {
    getPlans()
  }, [year])

  return { isPending, getUserPlans }
}
