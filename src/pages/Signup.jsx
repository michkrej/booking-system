import { useState } from 'react'
import useSignup from '../hooks/useSignup'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { Link } from 'react-router-dom'

import heart from '../images/LinTek_hjarta.png'
import { useLinkStyles } from './Login'
import { kårCommittees } from '../utils/helpers'
import { kårer } from '../utils/committees'

export default function Signup() {
  const [committee, setCommittee] = useState('')
  const [kår, setKår] = useState('')
  const [moreError, setMoreError] = useState(false)
  const { signup, error } = useSignup()

  const classes = useLinkStyles()

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    if (kår === '' || committee === '' || data.get('firstName').trim() === '') {
      setMoreError('You have missed to fill out some field')
    } else {
      setMoreError(false)
      signup(data.get('email'), data.get('password'), data.get('firstName'), committee)
    }
  }

  const handleChange = (event) => {
    setCommittee(event.target.value)
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
          Skapa konto
        </Typography>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!error && moreError && <p style={{ color: 'red' }}>{moreError}</p>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                <InputLabel>Kår</InputLabel>
                <Select label="Kår" value={kår} onChange={(e) => setKår(e.target.value)} id="kår">
                  {Object.keys(kårer).map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ pt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Fadderi</InputLabel>
              <Select label="Fadderi" value={committee} onChange={handleChange} id="committee">
                {kårCommittees(kår).map((assignee) => (
                  <MenuItem key={assignee.text} value={assignee.id}>
                    {assignee.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
