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
    const [currentLocation, setCurrentLocation] = useState(locations[0])
    const [filteredRooms, setFilteredRooms] = useState(rooms)

    const handleChange = (selectedOption) => {
        setCurrentLocation(selectedOption)
    }

    const filterRooms = () => {
        if (currentLocation) {
            const tempRooms = rooms.filter(
                (room) => room.locationId === currentLocation.id
            )
            setFilteredRooms(tempRooms)
            return tempRooms
        } else {
            setFilteredRooms([])
            return []
        }
    }

    useEffect(() => {
        filterRooms()
    }, [currentLocation])

    const onAppointmentFormOpening = (e) => {
        const { form } = e
        form.beginUpdate()
        const validation = [{ type: 'required' }]

        e.popup.option('showTitle', true)
        e.popup.option(
            'title',
            e.appointmentData.text
                ? e.appointmentData.text
                : 'Ange information om din bokning'
        )

        let mainGroupItems = form.itemOption('mainGroup').items
        if (
            mainGroupItems.find(
                (i) =>
                    i.itemType === 'group' && i.items[0].dataField === 'allDay'
            )
        ) {
            mainGroupItems.splice(2, 1)
        }

        mainGroupItems[0] = {
            ...mainGroupItems[0],
            label: {
                text: 'Aktivitet',
            },
            validationRules: [{ type: 'required' }],
        }
        mainGroupItems[1].items[0].label.text = 'Starttid'
        mainGroupItems[1].items[2].label.text = 'Sluttid'
        mainGroupItems[3].label.text = 'Beskrivning'
        let room = form.itemOption('mainGroup.roomId')
        room.editorOptions = {
            ...room.editorOptions,
            dataSource: filteredRooms,
            searchEnabled: true,
        }
        room.validationRules = validation
        room.colSpan = 2

        let formItems = form.option('items')
        if (
            !formItems.find(function (i) {
                return (
                    i.dataField ===
                    ('bankset' || 'bord' || 'grillar' || 'annat')
                )
            })
        ) {
            formItems.push(
                {
                    label: { text: 'Bänkset' },
                    editorType: 'dxNumberBox',
                    dataField: 'bankset',
                    validationRules: validation,
                },
                {
                    label: { text: 'Bord' },
                    editorType: 'dxNumberBox',
                    dataField: 'bord',
                    validationRules: validation,
                },
                {
                    label: { text: 'Grillar' },
                    editorType: 'dxNumberBox',
                    dataField: 'grillar',
                    validationRules: validation,
                },
                { itemType: 'empty' },
                {
                    colSpan: 2,
                    label: { text: 'Annat som behöver bokas' },
                    editorType: 'dxTextArea',
                    dataField: 'annat',
                }
            )
            form.option('items', formItems)
        }

        form.endUpdate()
        form.repaint()
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <SelectLocation
                        locations={locations}
                        handleChange={handleChange}
                        current={currentLocation}
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
                        onAppointmentFormOpening={onAppointmentFormOpening}
                    >
                        <Resource
                            dataSource={filteredRooms}
                            fieldExpr="roomId"
                            label="Rum"
                            useColorAsDefault={true}
                            allowMultiple={true}
                        />
                        {/*                         <Resource
                            dataSource={locations}
                            fieldExpr="locationId"
                            label="Plats"
                        /> */}
                    </Scheduler>
                </Grid>
            </Grid>
        </>
    )
}

export default Timeline
