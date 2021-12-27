import * as React from 'react'
import { Container, Grid } from '@mui/material'
import Schedule from '../components/Schedule'
import Nav from '../components/Nav'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../App'

export default function Booking() {
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
