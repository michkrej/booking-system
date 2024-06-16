import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import App from './App'

import 'devextreme/dist/css/dx.light.css'
import '@fontsource-variable/inter'
import './styles/global.css'

const container = document.getElementById('root')
const root = createRoot(container!!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
