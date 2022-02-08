import { Outlet, Navigate, useLocation } from 'react-router-dom'
import useAuthContext from '../hooks/useAuthContext'

const RequireAuth = () => {
  const { user } = useAuthContext()
  const location = useLocation()

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} />
  }

  return <Outlet />
}

export default RequireAuth
