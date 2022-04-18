import ReactDOM from 'react-dom'
import App from './App'
import AuthContextProvider from './context/AuthContextProvider'
import PlansContextProvider from './context/PlanContextProvider'

if (window.location.hostname == 'localhost') self.FIREBASE_APPCHECK_DEBUG_TOKEN = true

ReactDOM.render(
  <AuthContextProvider>
    <PlansContextProvider>
      <App />
    </PlansContextProvider>
  </AuthContextProvider>,
  document.getElementById('root')
)
