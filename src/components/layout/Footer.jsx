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
          Om något saknas eller inte fungerar som det ska, fyll i{' '}
          <Link href="https://forms.gle/tW28rpuNSWfQHNCq5" target="_notarget" color="inherit">
            feedback-formuläret
          </Link>
        </Typography>
        <Copyright />
      </Container>
    </Box>
  )
}

export default Footer
