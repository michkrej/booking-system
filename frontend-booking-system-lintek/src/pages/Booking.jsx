import * as React from 'react'
import { Container, Grid } from '@mui/material'
/* import Schedule from '../components/Schedule' */
import Nav from '../components/Nav'
import Timeline from '../components/Timeline'

export default function Booking() {
    return (
        <Container maxWidth="false">
            <Nav id="nav" />
            <Grid container>
                <Grid item xs={12} mt={5}>
                    <Timeline />
                </Grid>
            </Grid>
        </Container>
    )
}
