import { useEffect, useState } from 'react'
import usePlansContext from '../context/usePlansContext'
import { getAllPlans } from '../../firebase/dbActions'
import useAdminSettings from '../useAdminSettings'
import useAuthContext from '../context/useAuthContext'

const useGetPlans = () => {
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = usePlansContext()
  const { user } = useAuthContext()
  const { checked } = useAdminSettings()

  const getPlans = async () => {
    setIsPending(true)
    const { plans: _plans, publicPlans } = await getAllPlans(user)
    dispatch({
      type: 'LOAD',
      payload: { plans: _plans, publicPlans, admin: checked }
    })
    setIsPending(false)
  }

  useEffect(() => {
    getPlans()
  }, [])

  return { isPending }
}

export default useGetPlans
