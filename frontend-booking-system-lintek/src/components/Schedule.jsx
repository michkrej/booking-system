/* eslint-disable react/prop-types */
import * as React from 'react'
import Paper from '@mui/material/Paper'
import {
    ViewState,
    EditingState,
    IntegratedEditing,
} from '@devexpress/dx-react-scheduler'
import {
    Scheduler,
    WeekView,
    Toolbar,
    DateNavigator,
    Appointments,
    AppointmentForm,
    AppointmentTooltip,
    ConfirmationDialog,
    DayView,
    ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui'
import { createStyles, makeStyles } from '@mui/styles'

import BasicLayout from './AppointmentForm'
import Appointment from './Appointment'
import TimeScale from './TimeScale'
import CalendarCell from './CalendarCell'

export const options = [
    { key: 'S27', group: 'C-huset' },
    { key: 'S26', group: 'C-huset' },
    { key: 'S25', group: 'C-huset' },
    { key: 'C23', group: 'Utomhus' },
]

const styles = () =>
    createStyles({
        text: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        content: {
            opacity: 0.7,
        },
        container: {
            width: '100%',
            lineHeight: 1.2,
            height: '100%',
        },
    })

const Schedule = () => {
    const [data, setData] = React.useState([
        {
            title: 'Namn',
            startDate: new Date('2022-08-15 8:00'),
            endDate: new Date('2022-08-15 9:00'),
            location: 1,
            id: 0,
        },
        {
            title: 'Namn',
            startDate: new Date('2022-08-17 8:00'),
            endDate: new Date('2022-08-17 11:00'),
            location: 0,
            id: 1,
        },
    ])

    const [addedAppointment, setAddedAppointment] = React.useState({})
    const [appointmentChanges, setAppointmentChanges] = React.useState({})
    const [editingAppointment, setEditingAppointment] =
        React.useState(undefined)

    const commitChanges = ({ added, changed, deleted }) => {
        let temp = data
        if (added) {
            const startingAddedId =
                data.length > 0 ? data[data.length - 1].id + 1 : 0
            temp = [...data, { id: startingAddedId, ...added }]
        }

        if (changed) {
            temp = data.map((appointment) =>
                changed[appointment.id]
                    ? { ...appointment, ...changed[appointment.id] }
                    : appointment
            )
        }
        if (deleted !== undefined) {
            temp = data.filter((appointment) => appointment.id !== deleted)
        }
        setData(temp)
        return { temp }
    }
    return (
        <Paper>
            <Scheduler
                data={data}
                locale="sv-SE"
                firstDayOfWeek={1}
                height={
                    window.innerHeight -
                    document.querySelector('#nav') -
                    document.querySelector('#footer') -
                    250
                }
            >
                <ViewState defaultCurrentDate="2022-08-16" />
                <EditingState
                    onCommitChanges={commitChanges}
                    addedAppointment={addedAppointment}
                    onAddedAppointmentChange={setAddedAppointment}
                    appointmentChanges={appointmentChanges}
                    onAppointmentChangesChange={setAppointmentChanges}
                    editingAppointment={editingAppointment}
                    onEditingAppointmentChange={setEditingAppointment}
                />
                <IntegratedEditing />
                <WeekView
                    displayName="Vecka"
                    startDayHour={6}
                    endDayHour={24}
                    cellDuration={60}
                    timeScaleLabelComponent={TimeScale}
                    timeTableCellComponent={CalendarCell}
                />
                <DayView
                    displayName={'Dag'}
                    startDayHour={6}
                    endDayHour={24}
                    cellDuration={60}
                    timeScaleLabelComponent={TimeScale}
                    timeTableCellComponent={CalendarCell}
                />
                <Toolbar />
                <DateNavigator />
                <ConfirmationDialog
                    messages={{
                        discardButton: 'Överge',
                        deleteButton: 'Radera',
                        cancelButton: 'Avbryt',
                        confirmDeleteMessage:
                            'Är du säker att du vill redera denna händelse?',
                        confirmCancelMessage:
                            'Är du säker att du vill överge dina osparade ändringar?',
                    }}
                />
                <ViewSwitcher />
                <Appointments appointmentContentComponent={Appointment} />
                <AppointmentTooltip showOpenButton showDeleteButton />
                <AppointmentForm
                    booleanEditorComponent={(props) => (
                        <AppointmentForm.BooleanEditor
                            {...props}
                            style={{ display: 'none' }}
                        />
                    )}
                    basicLayoutComponent={BasicLayout}
                    messages={{
                        detailsLabel: 'Detaljer',
                        allDayLabel: 'Hela dagen',
                        titleLabel: 'Titel',
                        commitCommand: 'Spara',
                        moreInformationLabel: 'Beskrivning',
                        repeatLabel: 'Repetera',
                        notesLabel: 'Text...',
                    }}
                />
            </Scheduler>
        </Paper>
    )
}

export default Schedule
