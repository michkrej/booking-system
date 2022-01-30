import { Avatar, Button, TextField, Box, Typography, Container, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'

import heart from '../images/LinTek_hjarta.png'
import useLogin from '../hooks/useLogin'

export const useLinkStyles = makeStyles({
  link: {
    fontSize: '0.875rem',
    color: '#E1007A'
  }
})

export default function Login() {
  const classes = useLinkStyles()
  const { login } = useLogin()
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
        }}>
        <Avatar sx={{ m: 1, bgcolor: 'white' }} variant="square">
          <img src={heart} style={{ width: '100%' }} />
        </Avatar>
        <Typography component="h2" variant="h5">
          Logga in
        </Typography>
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
              <Link to="#" variant="body2" className={classes.link}>
                Glömt lösenord?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" variant="body2" className={classes.link}>
                {'Har du inte ett konto? Skapa ett'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
