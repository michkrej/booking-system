import { useState } from 'react'
import useSignup from '../hooks/useSignup'
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Select,
  MenuItem,
  Grid,
  FormControl,
  InputLabel
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'

import heart from '../images/LinTek_hjarta.png'
import { assignees } from '../utils/data'
import { useLinkStyles } from './Login'

export default function Signup() {
  const [commitee, setCommitee] = useState('')
  const classes = useLinkStyles()
  const { signup, isPending, error } = useSignup()
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    signup(
      data.get('email'),
      data.get('password'),
      `${data.get('firstName')} ${data.get('lastName')}`,
      commitee
    )
  }

  const handleChange = (event) => {
    setCommitee(event.target.value)
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
          Skapa konto
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Förnamn"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Efternamn"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="E-mail"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Lösenord"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Fadderi</InputLabel>
                <Select label="Fadderi" value={commitee} onChange={handleChange} id="commitee">
                  {assignees.map((assignee) => (
                    <MenuItem key={assignee.text} value={assignee.text}>
                      {assignee.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Skapa konto
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/" variant="body2" className={classes.link}>
                Har du redan ett konto? Logga in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
