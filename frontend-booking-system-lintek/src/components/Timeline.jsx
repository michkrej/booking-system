import React, { useState, useEffect } from 'react'

import Scheduler, { Resource } from 'devextreme-react/scheduler'

import {
    data,
    assignees,
    rooms,
    priorities,
    locations,
    resourcesList,
} from '../utils/data'
import Grid from '@mui/material/Grid'
import SelectLocation from './SelectLocation'

const currentDate = new Date('2021-04-26T16:30:00.000Z')
const views = ['timelineDay', 'timelineWeek']
const groups = ['roomId']

const Timeline = () => {
    const [currentLocation, setCurrentLocation] = useState(undefined)
    const [filteredRooms, setFilteredRooms] = useState(rooms)

    const onAppointmentFormOpening = (e) => {
        const { form } = e

        const startDateTimezoneEditor = form.getEditor('startDateTimeZone')
        const endDateTimezoneEditor = form.getEditor('endDateTimeZone')
        const startDateDataSource = startDateTimezoneEditor.option('dataSource')
        const endDateDataSource = endDateTimezoneEditor.option('dataSource')

        startDateDataSource.filter(['id', 'contains', 'Europe'])
        endDateDataSource.filter(['id', 'contains', 'Europe'])

        startDateDataSource.load()
        endDateDataSource.load()
    }

    const handleChange = (selectedOption) => {
        console.log(selectedOption)
        setCurrentLocation(selectedOption)
    }

    const filterRooms = () => {
        if (currentLocation) {
            const tempRooms = rooms.filter(
                (room) => room.locationId === currentLocation.id
            )
            setFilteredRooms(tempRooms)
        }
    }

    useEffect(() => {
        filterRooms()
    }, [currentLocation])

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <SelectLocation
                        locations={locations}
                        handleChange={handleChange}
                    />
                </Grid>
                <Grid item xs={10}>
                    <Scheduler
                        timeZone="America/Los_Angeles"
                        dataSource={data}
                        views={views}
                        defaultCurrentView="timelineDay"
                        defaultCurrentDate={currentDate}
                        height={580}
                        groups={groups}
                        cellDuration={120}
                        firstDayOfWeek={1}
                        startDayHour={8}
                        endDayHour={20}
                        style={{ zIndex: 1 }}
                    >
                        <Resource
                            dataSource={filteredRooms}
                            fieldExpr="roomId"
                            label="Room"
                            useColorAsDefault={true}
                            allowMultiple={true}
                        />
                        <Resource
                            dataSource={locations}
                            fieldExpr="locationId"
                            label="Plats"
                        />
                    </Scheduler>
                </Grid>
            </Grid>
        </>
    )
}

export default Timeline
