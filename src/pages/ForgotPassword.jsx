import { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

import heart from '../images/LinTek_hjarta.png'
import Error from '../components/Error'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/config'
import { Grid } from '@mui/material'
import { StyledLink } from './Signup'
import { useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { delay } from '../utils/helpers'

export default function ForgotPassword() {
  const [error, setError] = useState()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = () => {
    setLoading(true)
    setError(undefined)
    setSuccess(undefined)
    sendPasswordResetEmail(auth, email)
      .then(async () => {
        setSuccess(true)
        await delay(500)
        navigate('/')
      })
      .catch((error) => {
        setError(error.message)
      })
    setLoading(false)
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
          Återställ lösenord
        </Typography>
        {error && <Error message={error} />}
        {success && (
          <Typography
            variant="subtitle2"
            sx={{ color: 'green', marginTop: '1rem', alignSelf: 'center' }}
          >
            Mejl har skickats!
          </Typography>
        )}
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
            loading={loading}
            disabled={email.length < 1}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
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
