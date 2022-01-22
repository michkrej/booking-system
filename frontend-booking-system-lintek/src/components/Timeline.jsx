import React from 'react'

import Scheduler, { Resource } from 'devextreme-react/scheduler'

import {
    data,
    assignees,
    rooms,
    priorities,
    resourcesList,
} from '../utils/data'

const currentDate = new Date('2021-04-26T16:30:00.000Z')
const views = [
    'timelineDay',
    'timelineWeek',
    'timelineWorkWeek',
    'timelineMonth',
]
const groups = ['roomId']

const Timeline = () => {
    return (
        <Scheduler
            timeZone="America/Los_Angeles"
            dataSource={data}
            views={views}
            defaultCurrentView="timelineMonth"
            defaultCurrentDate={currentDate}
            height={580}
            groups={groups}
            cellDuration={120}
            firstDayOfWeek={1}
            startDayHour={8}
            endDayHour={20}
        >
            <Resource
                dataSource={rooms}
                fieldExpr="roomId"
                label="Room"
                useColorAsDefault={true}
            />
            <Resource
                dataSource={priorities}
                fieldExpr="priorityId"
                label="Priority"
            />
            <Resource
                dataSource={assignees}
                allowMultiple={true}
                fieldExpr="assigneeId"
                label="Assignee"
            />
        </Scheduler>
    )
}

export default Timeline
