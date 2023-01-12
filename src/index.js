import { createRoot } from 'react-dom/client'
import App from './App'
import AuthContextProvider from './context/AuthContextProvider'
import PlansContextProvider from './context/PlanContextProvider'

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(
  <AuthContextProvider>
    <PlansContextProvider>
      <App />
    </PlansContextProvider>
  </AuthContextProvider>
)
