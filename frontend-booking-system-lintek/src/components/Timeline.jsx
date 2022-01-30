import { useState, useEffect } from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler'
import PropTypes from 'prop-types'
import { data, rooms, locations } from '../utils/data'
const currentDate = new Date('2021-04-26T16:30:00.000Z')
const views = ['timelineDay', 'timelineWeek']

const Timeline = ({ currentLocation, store }) => {
    const [filteredRooms, setFilteredRooms] = useState(rooms)
    const [groups, setGroups] = useState(['locationId'])

    const filterRooms = () => {
        if (currentLocation) {
            const tempRooms = rooms.filter(
                (room) => room.locationId === currentLocation.id
            )
            setFilteredRooms(tempRooms)
            return tempRooms
        } else {
            setFilteredRooms(rooms)
            return rooms
        }
    }

    /** TODO
     * När vyn där allt grupperas på hus går det att välja alla lokaler oavsett var man klickar
     */
    useEffect(() => {
        filterRooms()
        if (!currentLocation) {
            setGroups(['locationId'])
        } else {
            setGroups(['roomId'])
        }
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

        if (currentLocation) {
            form.updateData('locationId', currentLocation.id)
        }

        let location = form.itemOption('mainGroup.locationId')
        location.editorOptions = {
            ...location.editorOptions,
            readOnly: true,
        }
        form.endUpdate()
        form.repaint()
    }

    return (
        <>
            <Scheduler
                timeZone="America/Los_Angeles"
                dataSource={data /*store*/}
                views={views}
                defaultCurrentView="timelineDay"
                defaultCurrentDate={currentDate}
                height={580}
                groups={groups}
                cellDuration={120}
                firstDayOfWeek={1}
                startDayHour={8}
                endDayHour={20}
                editing={groups[0] !== 'locationId'}
                onAppointmentFormOpening={onAppointmentFormOpening}
            >
                <Resource
                    dataSource={locations}
                    fieldExpr="locationId"
                    label="Plats"
                />
                <Resource
                    dataSource={filteredRooms}
                    fieldExpr="roomId"
                    label="Del"
                    allowMultiple={true}
                />
            </Scheduler>
        </>
    )
}

Timeline.propTypes = {
    currentLocation: PropTypes.object,
    store: PropTypes.object,
}

export default Timeline
