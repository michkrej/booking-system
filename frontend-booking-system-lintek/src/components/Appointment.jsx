/* eslint-disable react/prop-types */
import * as React from 'react'
import { options } from './Schedule'
import './styles.css'
import { withStyles, Theme, createStyles } from '@material-ui/core'
import { primary } from '../App'
import { Hidden } from '@mui/material'

const styles = () =>
    createStyles({
        text: {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        content: {
            opacity: 0.7,
            whiteSpace: 'pre-wrap',
            display: 'inline-block',
            overflow: 'hidden',
        },
        container: {
            width: '100%',
            lineHeight: 1.2,
            height: '100%',
            backgroundColor: primary,

            marginTop: '-1px',
            display: 'flex',
            paddingLeft: '0.5em',
            paddingTop: '0.5em',
            flexDirection: 'column',
            color: 'white',
            border: '1px solid white',
            borderRadius: '4px',
        },
    })

const Appointment = ({ classes, data, ...restProps }) => {
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
    return (
        <div {...restProps} className={classes.container}>
            <div className={classes.text}>{data.title}</div>
            {data.location !== undefined ? (
                <div className={`${classes.text} ${classes.content}`}>
                    {`${formatTime(data.startDate)}, ${
                        options[data.location].key
                    }`}
                </div>
            ) : (
                <div className={`${classes.text} ${classes.content}`}>
                    {`${formatTime(data.startDate)} - ${formatTime(
                        data.endDate
                    )}`}
                </div>
            )}
        </div>
    )
}

export default withStyles(styles)(Appointment)
