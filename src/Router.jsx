import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'

import { LoginPage } from './pages/login.page'
import { ForgotPasswordPage } from './pages/forgotPassword.page'
import { DashboardPage } from './pages/dashboard.page'
import { useHasUser } from './state/store'

const Fallback = () => {
  return (
    <>
      {/* <Nav /> */}
      hello
      {/* <Footer /> */}
    </>
  )
}

const RequireAuth = () => {
  const hasUser = useHasUser()
  const location = useLocation()

  if (!hasUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page. Not that it matters much in this case.
    return <Navigate to="/" state={{ from: location }} />
  }

  return <Outlet />
}

const Router = () => {
  const hasUser = useHasUser()

  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          {/*<Route exact path="/resetPassword" element={<ForgotPassword />} />
          <Route element={<RequireAuth />}>
            <Route exact path="/booking/:id/:year" element={<CalendarView />} />
            <Route exact path="/collisions/:id/:year" element={<CalendarView findCollisions />} />
            <Route
              exact
              path="/collisions/all/:id/:year"
              element={<CalendarView findCollisions />}
            />
            <Route exact path="/overview" element={<Overview />} />
            <Route exact path="/allEvents/:id/:year" element={<CalendarView showAllEvents />} />
          </Route> */}
          <Route
            path="*"
            element={
              <main style={{ padding: '1rem' }}>
                <p>Oops, denna sidan är tom!</p>
              </main>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
