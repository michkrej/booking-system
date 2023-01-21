import { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'

export const PlansContext = createContext()
export const plansReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE':
      return { ...state, plans: [...state.plans, action.payload] }
    case 'LOAD':
      return {
        ...state,
        plans: action.payload.plans,
        publicPlans: action.payload.publicPlans
      }
    case 'DELETE':
      return { ...state, plans: state.plans.filter((plan) => action.payload.id !== plan.id) }
    case 'UPDATE':
      return {
        ...state,
        plans: state.plans.map((plan) => (plan.id === action.payload.id ? action.payload : plan))
      }
    case 'UPDATE_PUBLIC':
      return {
        ...state,
        plans: state.plans.map((plan) => (plan.id === action.payload.id ? action.payload : plan)),
        publicPlans: action.payload.public
          ? [...state.publicPlans, action.payload]
          : state.publicPlans.filter((plan) => plan.id !== action.payload.id)
      }
    default:
      return state
  }
}

const PlansContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(plansReducer, {
    plans: undefined,
    publicPlans: undefined
  })

  // console.log(state)
  return <PlansContext.Provider value={{ ...state, dispatch }}>{children}</PlansContext.Provider>
}

PlansContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}
export default PlansContextProvider
