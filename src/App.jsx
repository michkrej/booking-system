import { lazy, Suspense, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Box, CircularProgress } from '@mui/material'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { locale, loadMessages } from 'devextreme/localization'
import seMessages from 'devextreme/localization/messages/sv.json'
import useAuthContext from './hooks/useAuthContext'

import 'devextreme/dist/css/dx.light.css'

import Footer from './components/Footer'
import Login from './pages/Login'
import RequireAuth from './components/RequireAuth'
import Nav from './components/Nav'

const Booking = lazy(() => import('./pages/Booking'))
const Overview = lazy(() => import('./pages/Overview'))
const Signup = lazy(() => import('./pages/Signup'))
const Collisions = lazy(() => import('./pages/Collisions'))

export const primary = '#E1007A'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#E1007A'
    },
    secondary: {
      main: '#D786B3'
    }
  }
})

function App() {
  const { authFinished, user } = useAuthContext()

  useEffect(() => {
    loadMessages(seMessages)
    locale(navigator.language)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
        maxWidth="false"
      >
        <CssBaseline />
        <Container component="main" pb={5} sx={{ flexGrow: 1 }} maxWidth="xl">
          {authFinished && (
            <BrowserRouter>
              <Suspense
                fallback={
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
                }
              >
                <Routes>
                  <Route exact path="/" element={user ? <Navigate to="/overview" /> : <Login />} />
                  <Route
                    exact
                    path="/signup"
                    element={user ? <Navigate to="/overview" /> : <Signup />}
                  />
                  <Route element={<RequireAuth />}>
                    <Route exact path="/booking/:id" element={<Booking />} />
                    <Route exact path="/collisions/:id" element={<Collisions />} />
                    <Route exact path="/overview" element={<Overview />} />
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
          )}
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default App
