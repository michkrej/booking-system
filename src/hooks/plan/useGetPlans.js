import { useEffect, useState } from 'react'
import usePlansContext from '../context/usePlansContext'
import { getAllPlans, getUserPlans as _getUserPlans } from '../../firebase/dbActions'
import useAdminSettings from '../useAdminSettings'
import useAuthContext from '../context/useAuthContext'

const useGetPlans = (year) => {
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = usePlansContext()
  const { user } = useAuthContext()
  const { checked } = useAdminSettings()

  const getPlans = async () => {
    setIsPending(true)
    const { plans: _plans, publicPlans } = await getAllPlans(user, year)
    dispatch({
      type: 'LOAD',
      payload: { plans: _plans, publicPlans, admin: checked }
    })
    setIsPending(false)
  }

  const getUserPlans = async () => {
    setIsPending(true)
    const plans = await _getUserPlans(user, year)
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
