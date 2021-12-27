import * as React from 'react'
import { Container, Grid } from '@mui/material'
import Schedule from '../components/Schedule'

const currentDate = '2018-11-01'
const schedulerData = [
    {
        startDate: '2018-11-01T09:45',
        endDate: '2018-11-01T11:00',
        title: 'Meeting',
    },
    {
        startDate: '2018-11-01T12:00',
        endDate: '2018-11-01T13:30',
        title: 'Go to a gym',
    },
]

export default function Booking() {
    return (
        <Container maxWidth="lg">
            <Grid container>
                <Grid item>
                    <Schedule />
                </Grid>
            </Grid>
        </Container>
    )
}
