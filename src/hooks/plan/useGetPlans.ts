import { useEffect, useState } from 'react'
import usePlansContext from '../context/usePlansContext'
import useAdminSettings from '../useAdminSettings'
import useAuthContext from '../context/useAuthContext'
import { PlansService } from '../../firebase/plans.service'

const useGetPlans = (year: number) => {
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = usePlansContext()
  const { user } = useAuthContext()
  const { checked } = useAdminSettings()

  const getPlans = async () => {
    setIsPending(true)
    try {
      const { plans: _plans, publicPlans } = await PlansService.getAllPlans(user, year)
      dispatch({
        type: 'LOAD',
        payload: { plans: _plans, publicPlans, admin: checked }
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
      payload: { plans, admin: checked }
    })
    setIsPending(false)
  }

  useEffect(() => {
    getPlans()
  }, [year])

  return { isPending, getUserPlans }
}

export default useGetPlans
