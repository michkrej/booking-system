import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import App from './App'
import AuthContextProvider from './context/AuthContextProvider'
import PlansContextProvider from './context/PlanContextProvider'

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(
  <StrictMode>
    <AuthContextProvider>
      <PlansContextProvider>
        <App />
      </PlansContextProvider>
    </AuthContextProvider>
  </StrictMode>
)
