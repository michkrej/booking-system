import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Nav from '../components/Nav'
import Timeline from '../components/Timeline'
import PropTypes from 'prop-types'

import useAuthContext from '../hooks/useAuthContext'

import { createCustomDataSource, defaultCampus, sortAlphabetically } from '../utils/helpers'
import { campuses, filterCampusLocations, filterCampusRooms, rooms } from '../data/locationsData'
import FilterTimelineLocations from '../components/FilterTimelineLocations'
import { useParams, useLocation } from 'react-router-dom'
import {
  findCollisionsBetweenAllEvents,
  findCollisionsBetweenUserPlanAndPublicPlans
} from '../utils/collisionHandling'

const allRoomsSorted = sortAlphabetically(rooms)

const CalendarView = ({ findCollissions = false, showAllEvents = false }) => {
  const { user } = useAuthContext()
  const { id } = useParams()
  const [currentLocation, setCurrentLocation] = useState()
  const [currentRoom, setCurrentRoom] = useState()
  const [campus, setCampus] = useState(defaultCampus(user.committeeId))
  const [filteredRooms, setFilteredRooms] = useState(filterCampusRooms(campus.label))
  const [locations, setLocations] = useState(
    sortAlphabetically(Object.values(filterCampusLocations(campus.label)))
  )

  const getDataSource = () => {
    if (findCollissions) {
      const findAll = useLocation().pathname.split('/')[2] === 'all'
      return findAll
        ? createCustomDataSource(id, { load: true }, findCollisionsBetweenAllEvents)
        : createCustomDataSource(id, { load: true }, findCollisionsBetweenUserPlanAndPublicPlans)
    } else if (showAllEvents) {
      return createCustomDataSource(id, {
        load: true,
        insert: false, // To work the insert functions needs to be updated, uses the currentUser instead of the owner of the plan
        remove: true,
        update: true
      })
    }
    return createCustomDataSource(user, {
      load: true,
      insert: true,
      remove: true,
      update: true
    })
  }

  const handleCampusChange = (option) => {
    setLocations(sortAlphabetically(Object.values(filterCampusLocations(option.label))))
    setCurrentLocation(undefined)
    setCampus(option)
  }

  // If C-huset selected, to be able to sort per corridors
  useEffect(() => {
    currentRoom
      ? setFilteredRooms(
          sortAlphabetically(
            currentLocation.rooms.filter((room) => room.text.startsWith(currentRoom.label[0]))
          )
        )
      : setFilteredRooms(allRoomsSorted)
  }, [currentRoom])

  useEffect(() => {
    currentLocation
      ? setFilteredRooms(sortAlphabetically(currentLocation.rooms))
      : setFilteredRooms(allRoomsSorted)
  }, [currentLocation])

  return (
    <Container maxWidth="false">
      <Nav id="nav" />
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={2}>
          <FilterTimelineLocations
            campuses={campuses}
            handleCampusChange={handleCampusChange}
            campus={campus}
            locations={locations}
            handleLocationChange={(option) => setCurrentLocation(option)}
            currentLocation={currentLocation}
            handleRoomChange={(option) => setCurrentRoom(option)}
            currentRoom={currentRoom}
          />
        </Grid>
        <Grid item xs={10}>
          <Timeline
            currentLocation={currentLocation}
            store={getDataSource()}
            rooms={filteredRooms}
            locations={locations}
            setRooms={setFilteredRooms}
            showCommittee={findCollissions || showAllEvents}
            edit={(!findCollissions && !showAllEvents) || (showAllEvents && user.admin)}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

CalendarView.propTypes = {
  findCollissions: PropTypes.bool,
  showAllEvents: PropTypes.bool
}

export default CalendarView
