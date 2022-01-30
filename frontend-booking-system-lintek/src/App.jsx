import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Box } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import 'devextreme/dist/css/dx.light.css'

import Footer from './components/Footer'
import Login from './pages/Login'
import Booking from './pages/Booking'
import Signup from './pages/Signup'
import Overview from './pages/Overview'

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
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <CssBaseline />
        <Container component="main" pb={5} sx={{ flexGrow: 1 }} maxWidth="xl">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="booking" element={<Booking />} />
              <Route path="/overview" element={<Overview />} />
            </Routes>
          </BrowserRouter>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default App
