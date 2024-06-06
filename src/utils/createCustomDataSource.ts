import CustomStore from 'devextreme/data/custom_store'
import { plansService } from '../services/plans.service'
import { Plan, PlanEvent, User } from './interfaces'

interface CustomDataSourceOptions {
  load?: boolean
  insert?: boolean
  remove?: boolean
  update?: boolean
}

interface CustomDataSourceParams {
  user: User
  options: CustomDataSourceOptions
  collisionFunction?: (events: Plan[]) => PlanEvent[]
  plans: Plan[]
}

export const createCustomDataSource = (params: CustomDataSourceParams) => {
  const { user, options, collisionFunction, plans } = params
  const { load, insert, remove, update } = options

  return new CustomStore<PlanEvent | null, any>({
    key: 'id',
    load: async () => {
      if (load) {
        if (collisionFunction) {
          console.log(plans)
          return collisionFunction(plans)
        }
        return plans.flatMap((plan) => plan.events)
      }
      return []
    },
    insert: async (values) => {
      if (insert && values) {
        const planId = window.location.pathname.split('/')[2]
        return await plansService.addPlanEvent(planId, {
          ...values,
          committeeId: user.committeeId
        })
      }
      return null
    },
    remove: async (id: string) => {
      if (remove && id) {
        const planId = window.location.pathname.split('/')[2]
        const plan = plans.filter((plan) => plan.id === planId)[0]
        await plansService.deletePlanEvent(plan, id)
      }
    },
    update: async (id: string, values) => {
      if (update && id && values) {
        const planId = window.location.pathname.split('/')[2]
        const plan = plans.filter((plan) => plan.id === planId)[0]
        return await plansService.updatePlanEvent(plan, { ...values, id })
      }
      return null
    }
  })
}
