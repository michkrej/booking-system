import moment from 'moment'
import * as React from 'react'

// eslint-disable-next-line react/prop-types
const TimeScale = ({ time }) => {
    return time ? (
        <div
            style={{
                height: '80px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '16px',
            }}
        >
            {moment(time).format('HH:mm')}
        </div>
    ) : (
        <div style={{ height: '40px' }}></div>
    )
}

export default TimeScale
