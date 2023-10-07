import { useEffect, useState } from 'react'
import usePlansContext from '../context/usePlansContext'
import { deletePlan, updatePlan, createPlan as _createPlan } from '../../firebase/dbActions'
import useAuthContext from '../context/useAuthContext'
import { useNavigate } from 'react-router-dom'

const useEditPlan = () => {
  const { dispatch, plans } = usePlansContext()
  const { user } = useAuthContext()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(undefined)
  const [newPlanId, setNewPlanId] = useState(undefined)
  const navigate = useNavigate()

  const changePlanName = (plan) => {
    setIsPending(true)
    setError(undefined)
    const label = window.prompt('Vad ska din planering byta namn till?')
    if (label.length < 1) {
      setError('Du måste ange ett namn')
    } else {
      updatePlan(plan.id, { ...plan, label })
      dispatch({
        type: 'UPDATE',
        payload: {
          ...plan,
          label
        }
      })
    }
    setIsPending(false)
  }

  const _deletePlan = (id) => {
    if (confirm(`Vill du verkligen radera '${plans.find((plan) => plan.id === id).label}'`)) {
      deletePlan(id)
      dispatch({
        type: 'DELETE',
        payload: {
          id: id
        }
      })
    }
  }

  const togglePublicPlan = (plan) => {
    setError(undefined)
    const hasPublicPlan = plans.some((plan) => plan.public)
    if (!plan.public && hasPublicPlan) {
      setError('Du kan bara ha en publik planering åt gången')
    } else {
      const _public = !plan.public
      const addCommittee = plan.committeeId ? {} : { committeeId: user.committeeId } // adding committee here in case it is an old plan
      updatePlan(plan.id, { public: _public, ...addCommittee })
      dispatch({
        type: 'UPDATE_PUBLIC',
        payload: {
          ...plan,
          public: _public,
          ...addCommittee
        }
      })
    }
  }

  const createPlan = async (year) => {
    setError(undefined)
    setIsPending(true)
    const name = window.prompt('Vad ska din ny planering heta?')
    if (name.length < 1) {
      setError('Du måste ange ett namn')
    } else {
      const planFields = {
        label: name,
        userId: user.uid,
        public: false,
        committeeId: user.committeeId,
        year: year
      }
      const { id } = await _createPlan(planFields)
      dispatch({
        type: 'CREATE',
        payload: {
          id,
          ...planFields
        }
      })
      setNewPlanId(id)
    }
    setIsPending(false)
  }

  useEffect(() => {
    if (newPlanId) navigate(`/booking/${newPlanId}`)
  }, [newPlanId])

  return { changePlanName, togglePublicPlan, _deletePlan, createPlan, isPending, error }
}

export default useEditPlan
