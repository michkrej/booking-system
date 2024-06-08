import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import RequireAuth from './components/RequireAuth'
import { LoginPage } from './pages/login.page'
import { ForgotPasswordPage } from './pages/forgotPassword.page'
import { useHasUser, useUser } from './state/store'

/* const Overview = lazy(() => import('./pages/Overview'))
const CalendarView = lazy(() => import('./pages/Calendar'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword')) */

const Fallback = () => {
  return (
    <>
      {/* <Nav /> */}
      hello
      {/* <Footer /> */}
    </>
  )
}

const Router = () => {
  const hasUser = useHasUser()

  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
