import { Link } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import styled from '@emotion/styled'

import heart from '../images/LinTek_hjarta.png'
import useLogin from '../hooks/useLogin'

const StyledLink = styled(Link)(() => ({
  fontSize: '0.875rem',
  color: '#E1007A'
}))

export default function Login() {
  const { login, error } = useLogin()
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    login(data.get('email'), data.get('password'))
  }

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
        <Avatar sx={{ m: 1, bgcolor: 'white' }} variant="square">
          <img src={heart} style={{ width: '100%' }} />
        </Avatar>
        <Typography component="h2" variant="h5">
          Logga in
        </Typography>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              {/* <StyledLink to="#" variant="body2" className={classes.link}>
                Glömt lösenord?
              </StyledLink> */}
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
