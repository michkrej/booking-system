import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import App from './App'

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
