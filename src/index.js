import ReactDOM from 'react-dom'
import App from './App'
import AuthContextProvider from './context/AuthContextProvider'
import PlansContextProvider from './context/PlanContextProvider'

ReactDOM.render(
  <AuthContextProvider>
    <PlansContextProvider>
      <App />
    </PlansContextProvider>
  </AuthContextProvider>,
  document.getElementById('root')
)
