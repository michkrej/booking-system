import { useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Box } from '@mui/material'
import { locale, loadMessages } from 'devextreme/localization'

import Footer from './components/layout/Footer'
import useAuthContext from './hooks/context/useAuthContext'
import Router from './Router'
import { color } from './CONSTANTS'

import seMessages from 'devextreme/localization/messages/sv.json'
import 'devextreme/dist/css/dx.light.css'

export const theme = createTheme({
  palette: {
    primary: {
      main: color.primary
    },
    secondary: {
      main: color.primary
    }
  }
})

function App() {
  const { authFinished } = useAuthContext()

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
        <Container component="main" pb={5} sx={{ flexGrow: 1 }} maxWidth="xxl">
          {authFinished && <Router />}
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default App
