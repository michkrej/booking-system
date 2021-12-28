/* eslint-disable react/prop-types */
import * as React from 'react'
import { options } from './Schedule'

const Appointment = ({ data, ...restProps }) => {
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
        <div {...restProps} data={data}>
            <div>
                <div>{data.title}</div>
                <div>
                    {`${formatTime(data.startDate)} - ${formatTime(
                        data.endDate
                    )}`}
                </div>
                <div>{`Location: ${options[data.location].key}`}</div>
            </div>
        </div>
    )
}

export default Appointment
