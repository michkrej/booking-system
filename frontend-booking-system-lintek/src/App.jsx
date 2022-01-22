import * as React from 'react'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Box } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import 'devextreme/dist/css/dx.light.css'

import Footer from './components/Footer'
import Login from './pages/Login'
import Booking from './pages/Booking'

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
                    <BrowserRouter>
                        <Routes>
                            {/* <Route path="/" element={<Login />} /> */}
                            <Route path="booking" element={<Booking />} />
                        </Routes>
                    </BrowserRouter>
                </Container>
                <Footer />
            </Box>
        </ThemeProvider>
    )
}

export default App
