import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlanActions, useUser, useUserPlans } from '@/state/store'
import { Plan } from '@/utils/interfaces'
import { plansService } from '@/services'

export const useEditPlan = () => {
  const userPlans = useUserPlans()
  const { user } = useUser()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { userPlanDeleted, userPlanUpdated, userPlanCreated } = usePlanActions()

  const changePlanName = (plan: Plan) => {
    setIsPending(true)
    setError(null)
    const label = window.prompt('Vad ska din planering byta namn till?')
    if (!label) {
      setError('Du måste ange ett namn')
    } else {
      plansService.updatePlanDetails(plan.id, { label }).then(() => {
        userPlanUpdated({ label, id: plan.id })
      })
    }
    setIsPending(false)
  }

  const deletePlan = async (id: string) => {
    const planToDelete = userPlans.find((plan) => plan.id === id)
    if (planToDelete && confirm(`Vill du verkligen radera '${planToDelete.label}'`)) {
      plansService.deletePlan(id).then(() => {
        userPlanDeleted(id)
      })
    }
  }

  const togglePublicPlan = (plan: Plan) => {
    setError(null)
    const hasPublicPlan = userPlans.some((plan) => plan.public)
    if (!plan.public && hasPublicPlan) {
      setError('Du kan bara ha en publik planering åt gången')
    } else {
      plansService.updatePlanDetails(plan.id, { public: !plan.public }).then(() => {
        userPlanUpdated({ id: plan.id, public: !plan.public })
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
      const newPlan = await plansService.createPlan({
        label: name,
        userId: user.userId,
        public: false,
        committeeId: user.committeeId,
        year: year,
        events: []
      })
      userPlanCreated(newPlan)
      navigate(`/booking/${newPlan.id}/${year}`)
    }
    setIsPending(false)
  }

  return { changePlanName, togglePublicPlan, deletePlan, createPlan, isPending, error }
}
