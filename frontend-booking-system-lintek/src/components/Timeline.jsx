/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Scheduler, { Resource, Scrolling } from 'devextreme-react/scheduler'
import PropTypes from 'prop-types'
import { data, rooms, locations, committees } from '../utils/data'
const currentDate = new Date('2022-08-16T00:00:00.000Z')
const views = ['timelineDay', 'timelineWeek']

const Timeline = ({ currentLocation, store, edit, showCommittee }) => {
  const [filteredRooms, setFilteredRooms] = useState(rooms)
  const [groups, setGroups] = useState(['locationId', showCommittee])

  const filterRooms = () => {
    if (currentLocation) {
      const tempRooms = rooms.filter((room) => room.locationId === currentLocation.id)
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
      validationRules: [{ type: 'required' }]
    }
    mainGroupItems[1].items[0].label.text = 'Starttid'
    mainGroupItems[1].items[2].label.text = 'Sluttid'
    mainGroupItems[3].label.text = 'Beskrivning'
    let room = form.itemOption('mainGroup.roomId')
    room.editorOptions = {
      ...room.editorOptions,
      dataSource: filteredRooms,
      searchEnabled: true
    }
    room.validationRules = validation
    room.colSpan = 2

    let formItems = form.option('items')
    if (
      !formItems.find(function (i) {
        return i.dataField === ('food' || 'alcohol' || 'karservice' || 'annat' || 'link')
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
          label: { text: 'Kårservice-inventarier (antal)' },
          editorType: 'dxTextArea',
          dataField: 'karservice',
          colSpan: 2
        },
        /*         {
          label: { text: 'Antal bord' },
          editorType: 'dxNumberBox',
          dataField: 'bord',
          validationRules: validation
        },
        {
          label: { text: 'Antal grillar' },
          editorType: 'dxNumberBox',
          dataField: 'grillar',
          validationRules: validation
        },
        { itemType: 'empty' }, */
        {
          colSpan: 2,
          label: { text: 'Övriga inventarier för bokningen' },
          editorType: 'dxTextArea',
          dataField: 'annat'
        },
        {
          colSpan: 2,
          label: {
            text: 'Länk till plats (om det är oklart)'
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
    form.endUpdate()
    form.repaint()
  }

  const scheduleHeight =
    filteredRooms.length === rooms.length ? rooms.length * 150 : filteredRooms.length * 200
  return (
    <>
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={store}
        views={views}
        defaultCurrentView="timelineDay"
        defaultCurrentDate={currentDate}
        groups={groups}
        height={scheduleHeight}
        cellDuration={60}
        firstDayOfWeek={1}
        startDayHour={8}
        endDayHour={24}
        editing={edit ? groups[0] !== 'locationId' : false}
        onAppointmentFormOpening={onAppointmentFormOpening}
        Auto
      >
        <Resource
          dataSource={locations}
          fieldExpr="locationId"
          label="Plats"
          useColorAsDefault={!showCommittee}
        />
        <Resource dataSource={filteredRooms} fieldExpr="roomId" label="Del" allowMultiple={true} />
        {showCommittee && (
          <Resource
            dataSource={committees}
            fieldExpr="committeeId"
            label="Fadderi"
            useColorAsDefault={true}
          />
        )}
        <Scrolling mode="virtual" />
      </Scheduler>
    </>
  )
}

Timeline.propTypes = {
  currentLocation: PropTypes.object,
  store: PropTypes.object,
  edit: PropTypes.bool,
  showCommittee: PropTypes.bool
}

export default Timeline
