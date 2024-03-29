import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import useLogin from '../hooks/user/useLogin'
import StyledLink from '../components/Link'
import Error from '../components/Error'

export default function Login() {
  const { login, error } = useLogin()

  return (
    <Container component="div" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ bgcolor: 'transparent', width: 120, height: 100 }} variant="square">
          <img src="./assets/LUST.png" style={{ width: '100%' }} />
        </Avatar>
        <Typography component="h2" variant="h5">
          Logga in
        </Typography>
        <Error message={error} />
        <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Din e-mail"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Lösenord"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Logga in
          </Button>
          <Grid container>
            <Grid item xs>
              <StyledLink to="/resetPassword" variant="body2">
                Glömt lösenord?
              </StyledLink>
            </Grid>
            <Grid item>
              <StyledLink to="/signup" variant="body2">
                {'Har du inte ett konto? Skapa ett'}
              </StyledLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
