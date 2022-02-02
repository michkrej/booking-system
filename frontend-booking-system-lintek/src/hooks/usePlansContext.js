import { useContext } from 'react'
import { PlansContext } from '../context/PlanContextProvider'

const usePlansContext = () => {
  const context = useContext(PlansContext)

  if (!context) {
    throw Error('usePlansContext must be inside an PansContextProvider')
  }

  return context
}

export default usePlansContext
