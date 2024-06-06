import { useEffect, useState } from 'react'
import usePlansContext from '../context/usePlansContext'
import { PlansService } from '../../firebase/plans.service'
import { useNavigate } from 'react-router-dom'
import { Plan } from '../../utils/interfaces'
import { useUser } from '../../state/store'

export const useEditPlan = () => {
  const { dispatch, plans } = usePlansContext()
  const user = useUser()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const changePlanName = (plan: Plan) => {
    setIsPending(true)
    setError(null)
    const label = window.prompt('Vad ska din planering byta namn till?')
    if (!label) {
      setError('Du måste ange ett namn')
    } else {
      PlansService.updatePlanDetails(plan.id, { label })
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

  const _deletePlan = (id: string) => {
    if (confirm(`Vill du verkligen radera '${plans.find((plan) => plan.id === id).label}'`)) {
      PlansService.deletePlan(id)
      dispatch({
        type: 'DELETE',
        payload: {
          id: id
        }
      })
    }
  }

  const togglePublicPlan = (plan: Plan) => {
    setError(null)
    const hasPublicPlan = plans.some((plan) => plan.public)
    if (!plan.public && hasPublicPlan) {
      setError('Du kan bara ha en publik planering åt gången')
    } else {
      PlansService.updatePlanDetails(plan.id, { public: !plan.public })
      dispatch({
        type: 'UPDATE_PUBLIC',
        payload: {
          ...plan,
          public: !plan.public
        }
      })
    }
  }

  const createPlan = async (year: number) => {
    setError(null)
    setIsPending(true)
    const name = window.prompt('Vad ska din ny planering heta?')
    if (!name) {
      setError('Du måste ange ett namn')
    } else {
      const planFields = {
        label: name,
        userId: user,
        public: false,
        committeeId: user.committeeId,
        year: year,
        events: []
      }
      const newPlanId = await PlansService.createPlan(planFields)
      if (!newPlanId) {
        setError('Något gick fel')
        return
      }
      dispatch({
        type: 'CREATE',
        payload: {
          newPlanId,
          ...planFields
        }
      })
      navigate(`/booking/${newPlanId}/${year}`)
    }
    setIsPending(false)
  }

  return { changePlanName, togglePublicPlan, _deletePlan, createPlan, isPending, error }
}
