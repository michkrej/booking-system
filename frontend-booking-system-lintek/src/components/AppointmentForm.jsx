/* eslint-disable react/prop-types */
import * as React from 'react'
import { Container, Autocomplete, TextField, Grid } from '@mui/material'
import DateAdapter from '@mui/lab/AdapterMoment'
import DateTimePicker from '@mui/lab/DateTimePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import moment from 'moment'

import heart from '../images/LinTek_hjarta.png'
import { options } from './Schedule'

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    const onCustomFieldChange = (nextValue) => {
        onFieldChange({ location: nextValue })
    }

    return (
        <Container sx={{ m: 2 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Titel"
                name="title"
                value={appointmentData.title}
                onChange={(e) => onFieldChange({ title: e.target.value })}
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
                isOptionEqualToValue={(option, value) => option.id === value.id}
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
                            renderInput={(props) => <TextField {...props} />}
                            value={appointmentData.startDate}
                            onChange={(newValue) => {
                                onFieldChange({
                                    startDate: moment(newValue).toDate(),
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
                            renderInput={(props) => <TextField {...props} />}
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
    )
}

export default BasicLayout
