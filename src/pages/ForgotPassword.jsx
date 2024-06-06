import { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { LoadingButton } from '@mui/lab'

import Error from '../components/error'
import StyledLink from '../components/Link'
import { useResetPassword } from '../hooks'
import Success from '../components/Success'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const { isPending, error, success, forgotPassword } = useResetPassword()

  const handleSubmit = async () => {
    forgotPassword(email)
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
        <Avatar sx={{ bgcolor: 'transparent', width: 120, height: 100 }} variant="square">
          <img src="./assets/LUST.png" style={{ width: '100%' }} />
        </Avatar>
        <Typography component="h2" variant="h5">
          Återställ lösenord
        </Typography>
        <Error message={error} />
        <Success message={success} />
        <Box onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Din e-mail"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <LoadingButton
            loading={isPending}
            disabled={email.length < 1}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            type="submit"
            onClick={handleSubmit}
          >
            Skicka återställningsmejl
          </LoadingButton>
        </Box>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <StyledLink to="/" variant="body2">
              Tillbaka till inloggning
            </StyledLink>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
