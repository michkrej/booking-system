/* eslint-disable react/prop-types */
import * as React from 'react'
import { options } from './Schedule'
import './styles.css'
import { withStyles, Theme, createStyles } from '@material-ui/core'
import { primary } from '../App'

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
            backgroundColor: primary,
            borderRadius: '2px',
            marginTop: '-1px',
            display: 'flex',
            justifyContent: 'center',
            paddingLeft: '0.5em',
            flexDirection: 'column',
            color: 'white',
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
            <div className={`${classes.text} ${classes.content}`}>
                {`${formatTime(data.startDate)} - ${formatTime(data.endDate)}`}
            </div>
            <div className={`${classes.text} ${classes.content}`}>{`Plats: ${
                options[data.location].key
            }`}</div>
        </div>
    )
}

export default withStyles(styles)(Appointment)
