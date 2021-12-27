import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import { ViewState } from '@devexpress/dx-react-scheduler'
import {
    Scheduler,
    WeekView,
    Toolbar,
    DateNavigator,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui'
import { Container, Grid } from '@mui/material'

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
            <Grid continer>
                <Grid item>
                    <Paper>
                        <Scheduler
                            data={schedulerData}
                            locale="sv-SE"
                            firstDayOfWeek={1}
                            height={660}
                        >
                            <ViewState defaultCurrentDate="2022-08-16" />
                            <WeekView startDayHour={6} endDayHour={24} />
                            <Toolbar />
                            <DateNavigator />
                            <Appointments />
                        </Scheduler>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}
