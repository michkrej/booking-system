import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Box } from '@mui/material'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthContext from './hooks/useAuthContext'

import 'devextreme/dist/css/dx.light.css'

import Footer from './components/Footer'
import Login from './pages/Login'
import Booking from './pages/Booking'
import Signup from './pages/Signup'
import RequireAuth from './components/RequireAuth'

export const primary = '#E1007A'

export const theme = createTheme({
    palette: {
        primary: {
            main: '#E1007A',
        },
        secondary: {
            main: '#D786B3',
        },
    },
})

function App() {
    const { authFinished, user } = useAuthContext()
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <CssBaseline />
                <Container
                    component="main"
                    pb={5}
                    sx={{ flexGrow: 1 }}
                    maxWidth="xl"
                >
                    {authFinished && (
                        <BrowserRouter>
                            <Routes>
                                <Route
                                    exact
                                    path="/"
                                    element={user ? <Booking /> : <Login />}
                                />
                                <Route
                                    exact
                                    path="/signup"
                                    element={user ? <Booking /> : <Signup />}
                                />
                                <Route element={<RequireAuth />}>
                                    <Route
                                        exact
                                        path="booking"
                                        element={<Booking />}
                                    />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    )}
                </Container>
                <Footer />
            </Box>
        </ThemeProvider>
    )
}

export default App
