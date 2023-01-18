import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://bokningsplanering.com">
        Bokningsplanering
      </Link>{' '}
      2022 - {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography variant="body1">
          Vid frågor kontakta{' '}
          <Link
            href="mailto:michkrej@gmail.com"
            rel="noopener noreferrer"
            target="_top"
            color="inherit"
          >
            michkrej@gmail.com
          </Link>
        </Typography>
        <Copyright />
      </Container>
    </Box>
  )
}

export default Footer
