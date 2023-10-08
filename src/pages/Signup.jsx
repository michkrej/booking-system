import { useState } from 'react'
import useSignup from '../hooks/user/useSignup'
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

import { kårer } from '../data/committees'
import { kårCommittees, sortAlphabetically } from '../utils/helpers'
import Comment from '../components/Comment'
import StyledLink from '../components/Link'
import Error from '../components/Error'

export default function Signup() {
  const [committee, setCommittee] = useState('')
  const [kår, setKår] = useState('')
  const [moreError, setMoreError] = useState()
  const { signup, error } = useSignup()

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
        <Avatar sx={{ bgcolor: 'transparent', width: 120, height: 100 }} variant="square">
          <img src="./assets/LUST.png" style={{ width: '100%' }} />
        </Avatar>
        <Typography component="h2" variant="h5">
          Skapa konto
        </Typography>
        <Error message={error} />
        <Error message={moreError} />
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
              <Comment align="center">Använd fadderimejlen så kan planeringarna ärvas!</Comment>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: 0 }}>
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
          <Grid item xs={12} alignContent="center" pt={1}>
            <Comment align="center">
              Om du tillhör t.ex. kårledningen använd Fadderi - Övrigt
            </Comment>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Fadderi</InputLabel>
              <Select label="Fadderi" value={committee} onChange={handleChange} id="committee">
                {sortAlphabetically(kårCommittees(kår)).map((assignee) => (
                  <MenuItem key={assignee.text} value={assignee.id}>
                    {assignee.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
            Skapa konto
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <StyledLink to="/" variant="body2">
                Har du redan ett konto? Logga in
              </StyledLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
