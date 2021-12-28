import { WeekView } from '@devexpress/dx-react-scheduler-material-ui'
import * as React from 'react'

// eslint-disable-next-line react/prop-types
const CalendarCell = ({ children, ...restProps }) => {
    return (
        <WeekView.TimeTableCell
            {...restProps}
            style={{
                height: '80px',
            }}
        >
            {children}
        </WeekView.TimeTableCell>
    )
}
export default CalendarCell
