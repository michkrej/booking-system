import React from 'react'
import './App.css'
import Login from './Login'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Box } from '@mui/material'

import Footer from './Footer'

const theme = createTheme({
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
                    <Login />
                </Container>
                <Footer />
            </Box>
        </ThemeProvider>
    )
}

export default App
