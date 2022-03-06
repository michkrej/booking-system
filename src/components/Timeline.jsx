/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Scheduler, { Resource, Scrolling } from 'devextreme-react/scheduler'
import PropTypes from 'prop-types'
import { committees } from '../utils/data'
import useAuthContext from '../hooks/useAuthContext'
import { sortedLocations } from '../pages/Booking'

const currentDate = new Date('2022-08-16T00:00:00.000Z')
const views = ['timelineDay', 'timelineWeek', 'timelineMonth']

const Timeline = ({ currentLocation, store, edit, showCommittee, rooms = [] }) => {
  const { user } = useAuthContext()
  const [groups, setGroups] = useState(['locationId', 'committeeId'])

  useEffect(() => {
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
      e.appointmentData.text ? e.appointmentData.text : 'Ange information om din bokning'
    )

    let mainGroupItems = form.itemOption('mainGroup').items
    if (mainGroupItems.find((i) => i.itemType === 'group' && i.items[0].dataField === 'allDay')) {
      mainGroupItems.splice(2, 1)
    }

    mainGroupItems[0] = {
      ...mainGroupItems[0],
      label: {
        text: 'Aktivitet'
      },
      validationRules: validation
    }
    mainGroupItems[1].items[0].label.text = 'Starttid'
    mainGroupItems[1].items[2].label.text = 'Sluttid'
    mainGroupItems[3].label.text = 'Beskrivning'
    let room = form.itemOption('mainGroup.roomId')
    room.editorOptions = {
      ...room.editorOptions,
      dataSource: rooms,
      searchEnabled: true
    }
    room.validationRules = validation
    room.colSpan = 2

    if (!showCommittee) {
      form.updateData('committeeId', user.committeeId)
    }

    let formItems = form.option('items')
    if (
      !formItems.find(function (i) {
        return (
          i.dataField ===
          ('food' ||
            'alcohol' ||
            'bankset-k' ||
            'bankset-hg' ||
            'bord' ||
            'grillar' ||
            'bardiskar' ||
            'annat' ||
            'link')
        )
      })
    ) {
      formItems.push(
        {
          label: { text: 'Mat?' },
          editorType: 'dxCheckBox',
          dataField: 'food'
        },
        {
          label: { text: 'Alkohol?' },
          editorType: 'dxCheckBox',
          dataField: 'alcohol'
        },
        {
          label: { text: 'Kårallen - bänkset' },
          editorType: 'dxNumberBox',
          dataField: 'bankset-k',
          colSpan: 1
        },
        /*         {
          label: { text: 'Kårallen - bord' },
          editorType: 'dxNumberBox',
          dataField: 'bord',
          colSpan: 1,
        }, */
        {
          label: { text: 'Kårallen - grillar' },
          editorType: 'dxNumberBox',
          dataField: 'grillar',
          colSpan: 1
        },
        {
          label: { text: 'Kårallen - bardiskar' },
          editorType: 'dxNumberBox',
          dataField: 'bardiskar',
          colSpan: 2
        },
        {
          label: { text: 'HG - bänkset' },
          editorType: 'dxNumberBox',
          dataField: 'bankset-hg',
          colSpan: 2
        },
        {
          label: { text: 'Övriga inventarier för bokningen' },
          editorType: 'dxTextArea',
          dataField: 'annat',
          colSpan: 2
        },
        {
          colSpan: 2,
          label: {
            text: 'Google Maps länk till plats (t.ex. för hajk eller stadsvandring)'
          },
          editorType: 'dxTextBox',
          dataField: 'link'
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
      readOnly: true
    }

    let committee = form.itemOption('mainGroup.committeeId')
    committee.editorOptions = {
      ...committee.editorOptions,
      readOnly: true
    }
    committee.colSpan = 2

    form.endUpdate()
    //form.repaint()
  }

  const nRooms = rooms.length > 1 ? rooms.length : 6
  const scheduleHeight = currentLocation ? nRooms * 150 : 800
  return (
    <>
      <Scheduler
        timeZone="Europe/Stockholm"
        dataSource={store}
        views={views}
        defaultCurrentView="timelineDay"
        defaultCurrentDate={currentDate}
        groups={groups}
        cellDuration={120}
        firstDayOfWeek={1}
        startDayHour={8}
        endDayHour={24}
        editing={edit ? groups[0] !== 'locationId' : false}
        onAppointmentFormOpening={onAppointmentFormOpening}
        showAllDayPanel={false}
        height={scheduleHeight}
        //maxAppointmentsPerCell={2}
        crossScrollingEnabled={true}
      >
        <Resource
          dataSource={committees}
          fieldExpr="committeeId"
          label="Fadderi"
          useColorAsDefault={true}
        />
        <Resource dataSource={sortedLocations} fieldExpr="locationId" label="Plats" />
        <Resource dataSource={rooms} fieldExpr="roomId" label="Del" allowMultiple={true} />

        <Scrolling mode="standard" />
      </Scheduler>
    </>
  )
}

Timeline.propTypes = {
  currentLocation: PropTypes.object,
  store: PropTypes.object,
  edit: PropTypes.bool,
  showCommittee: PropTypes.bool,
  rooms: PropTypes.array
}

export default Timeline
