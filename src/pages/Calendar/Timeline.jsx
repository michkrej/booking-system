import { useState, useEffect, useCallback, useMemo } from 'react'
import Scheduler, { Resource, Scrolling } from 'devextreme-react/scheduler'
import PropTypes from 'prop-types'
import Appointment from './Appointment'
import bookableItems from '../../data/bookableItems'
import { views } from '../../CONSTANTS'
import { committees } from '../../data/committees'

import '../../styles/timeline.css'
import { useUser } from '../../state/store'

const Timeline = ({ currentLocation, store, edit, showCommittee, rooms = [], locations, year }) => {
  const { user } = useUser()
  const [groups, setGroups] = useState(['locationId', 'committeeId'])

  useEffect(() => {
    setGroups(currentLocation ? ['roomId'] : ['locationId'])
  }, [currentLocation])

  const onAppointmentFormOpening = useCallback(
    (e) => {
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
        /**
         * If you want to add repeating events write mainGroupItems[2].items.splice(0, 1) instead and change index for 'Beskriving' to 4
         */
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
        formItems.push(...bookableItems, {
          colSpan: 2,
          label: {
            text: 'Google Maps länk till plats (t.ex. för hajk eller stadsvandring)'
          },
          editorType: 'dxTextBox',
          dataField: 'link'
        })
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
      form.repaint()
    },
    [currentLocation, showCommittee, rooms]
  )

  const currentDate = useMemo(() => {
    const date = new Date(year, 7, 15)
    date.setDate(date.getDate() - date.getDay() + 1)
    return date
  }, [year])

  return (
    <>
      <Scheduler
        id="scheduler"
        timeZone="Europe/Stockholm"
        dataSource={store}
        views={views}
        defaultCurrentView="timelineDay"
        defaultCurrentDate={currentDate}
        groups={groups}
        cellDuration={120}
        firstDayOfWeek={1}
        startDayHour={6}
        endDayHour={24}
        editing={edit ? groups[0] !== 'locationId' : false}
        onAppointmentFormOpening={onAppointmentFormOpening}
        /* TODO: fix tooltip so it shows delete */
        //appointmentTooltipRender={AppointmentTooltip}
        appointmentRender={Appointment}
        height={window.innerHeight - 250}
        crossScrollingEnabled={true}
      >
        <Resource
          dataSource={committees}
          fieldExpr="committeeId"
          label="Fadderi"
          useColorAsDefault={true}
        />
        <Resource dataSource={locations} fieldExpr="locationId" label="Plats" />
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
  rooms: PropTypes.array,
  locations: PropTypes.array,
  year: PropTypes.number
}

export default Timeline
