import { useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Box } from '@mui/material'
import { locale, loadMessages } from 'devextreme/localization'

import Footer from './components/layout/Footer'
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
        <Container
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]
          }}
          maxWidth="xxl"
        >
          <Router />
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default App
