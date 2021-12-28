import * as React from 'react'
import { Container, Grid } from '@mui/material'
import Schedule from '../components/Schedule'
import Nav from '../components/Nav'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../App'
import { useAuth0 } from '@auth0/auth0-react'

export default function Booking() {
    const { user } = useAuth0()
    console.log(user)
    return (
        <Container maxWidth="xl">
            <Nav id="nav" />
            <Grid container>
                <Grid item xs={12} mt={5}>
                    <Schedule />
                </Grid>
            </Grid>
        </Container>
    )
}
