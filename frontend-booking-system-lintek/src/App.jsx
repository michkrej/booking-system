import * as React from 'react'
import Login from './components/Login'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Box } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import Booking from './pages/Booking'

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
                <Container component="main">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Login />} />
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
