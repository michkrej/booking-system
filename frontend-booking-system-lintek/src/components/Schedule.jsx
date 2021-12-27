/* eslint-disable react/prop-types */
import * as React from 'react'
import Paper from '@material-ui/core/Paper'
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
} from '@devexpress/dx-react-scheduler-material-ui'
import { Container, Autocomplete, TextField, Grid } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { primary, theme } from '../App'
import DateAdapter from '@mui/lab/AdapterMoment'
import DateTimePicker from '@mui/lab/DateTimePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import moment from 'moment'
import { Box } from '@mui/system'
import { withStyles, Theme, createStyles } from '@material-ui/core'

import heart from '../images/LinTek_hjarta.png'
import { green } from '@mui/material/colors'

const options = [
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
    const [data, setData] = React.useState([])

    const addZero = (time) => {
        if (time.toString().length > 1) {
            return time
        }
        return '0' + time.toString()
    }

    const formatTime = (date) => {
        return `${addZero(date.getHours())}:${
            date.getMinutes() === 0 ? '00' : date.getMinutes()
        }`
    }

    const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
        const onCustomFieldChange = (nextValue) => {
            onFieldChange({ location: nextValue })
        }

        return (
            <ThemeProvider theme={theme}>
                <Container sx={{ m: 2 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Titel"
                        name="title"
                        value={appointmentData.title}
                        onChange={(e) =>
                            onFieldChange({ title: e.target.value })
                        }
                    />
                    <Autocomplete
                        disablePortal
                        options={options.sort(
                            (a, b) => -b.group.localeCompare(a.group)
                        )}
                        groupBy={(option) => option.group}
                        getOptionLabel={(option) => {
                            if (Number.isInteger(option)) {
                                return options[option].key
                            }
                            return option.key
                        }}
                        fullWidth
                        onChange={(e) => onCustomFieldChange(e.target.value)}
                        value={appointmentData.location}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Lokal/område"
                                margin="normal"
                                required
                            />
                        )}
                    />
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <Grid container>
                            <Grid item xs={5} pt={3}>
                                <DateTimePicker
                                    renderInput={(props) => (
                                        <TextField {...props} />
                                    )}
                                    value={appointmentData.startDate}
                                    onChange={(newValue) => {
                                        onFieldChange({
                                            startDate:
                                                moment(newValue).toDate(),
                                        })
                                    }}
                                    label="Start"
                                    ampm={false}
                                    /* inputFormat="HH:mm DD-MM-YYYY" */
                                    minDate={moment('2022-08-01')}
                                    maxDate={moment('2022-10-01')}
                                    openTo="hours"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={2}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={heart}
                                    style={{ width: '20%', marginTop: '20px' }}
                                />
                                <img
                                    src={heart}
                                    style={{ width: '20%', marginTop: '15px' }}
                                />
                            </Grid>
                            <Grid item xs={5} pt={3}>
                                <DateTimePicker
                                    renderInput={(props) => (
                                        <TextField {...props} />
                                    )}
                                    value={appointmentData.endDate}
                                    onChange={(newValue) => {
                                        onFieldChange({
                                            endDate: moment(newValue).toDate(),
                                        })
                                    }}
                                    label="Slut"
                                    ampm={false}
                                    /* inputFormat="HH:mm DD-MM-YYYY" */
                                    minDate={moment('2022-08-01')}
                                    maxDate={moment('2022-10-01')}
                                    openTo="hours"
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                </Container>
            </ThemeProvider>
        )
    }

    const Appointment = ({ children, style, ...restProps }) => (
        <Appointments.Appointment
            {...restProps}
            style={{
                ...style,
                backgroundColor: primary,
                borderRadius: '8px',
            }}
        >
            {children}
        </Appointments.Appointment>
    )

    const AppointmentContent = withStyles(styles, {
        name: 'AppointmentContent',
    })(({ classes, data, ...restProps }) => {
        return (
            <Appointments.AppointmentContent {...restProps} data={data}>
                <div className={classes.container}>
                    <div className={classes.text}>{data.title}</div>
                    <div className={`${classes.text} ${classes.content}`}>
                        {`${formatTime(data.startDate)} - ${formatTime(
                            data.endDate
                        )}`}
                    </div>
                    <div className={`${classes.text} ${classes.content}`}>
                        {`Location: ${options[data.location].key}`}
                    </div>
                </div>
            </Appointments.AppointmentContent>
        )
    })

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
                <EditingState onCommitChanges={commitChanges} />
                <IntegratedEditing />
                <WeekView startDayHour={6} endDayHour={24} />
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
                <Appointments
                    appointmentComponent={Appointment}
                    appointmentContentComponent={AppointmentContent}
                />
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
