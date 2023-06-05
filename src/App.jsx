import { useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Box } from '@mui/material'
import { locale, loadMessages } from 'devextreme/localization'

import Footer from './components/Footer'
import useAuthContext from './hooks/context/useAuthContext'

import seMessages from 'devextreme/localization/messages/sv.json'
import 'devextreme/dist/css/dx.light.css'
import Router from './Router'

export const primary = '#670c47'
export const secondary = '#bcdfd7'
export const secondary2 = '#818389'

export const theme = createTheme({
  palette: {
    primary: {
      main: primary
    },
    secondary: {
      main: secondary
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
