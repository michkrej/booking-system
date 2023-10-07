import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

import Footer from './components/layout/Footer'
import Nav from './components/layout/Nav'
import useAuthContext from './hooks/context/useAuthContext'
import RequireAuth from './components/RequireAuth'
import Login from './pages/Login'

const Overview = lazy(() => import('./pages/Overview'))
const Signup = lazy(() => import('./pages/Signup'))
const CalendarView = lazy(() => import('./pages/Calendar'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

const Fallback = () => {
  return (
    <>
      <Nav />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
      <Footer />
    </>
  )
}

const Router = () => {
  const { user } = useAuthContext()

  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route exact path="/" element={user ? <Navigate to="/overview" /> : <Login />} />
          <Route exact path="/signup" element={user ? <Navigate to="/overview" /> : <Signup />} />
          <Route exact path="/resetPassword" element={<ForgotPassword />} />
          <Route element={<RequireAuth />}>
            <Route exact path="/booking/:id/:year" element={<CalendarView />} />
            <Route exact path="/booking/:id" element={<CalendarView />} />
            <Route exact path="/collisions/:id" element={<CalendarView findCollisions />} />
            <Route exact path="/collisions/all/:id" element={<CalendarView findCollisions />} />
            <Route exact path="/overview" element={<Overview />} />
            <Route exact path="/allEvents/:id" element={<CalendarView showAllEvents />} />
          </Route>
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
