import { useEffect, useState } from 'react'
import usePlansContext from '../context/usePlansContext'
import useAdminSettings from '../useAdminSettings'
import { PlansService } from '../../firebase/plans.service'
import { useUser } from '../../state/store'

const useGetPlans = (year: number) => {
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = usePlansContext()
  const { checked } = useAdminSettings()
  const user = useUser()

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
