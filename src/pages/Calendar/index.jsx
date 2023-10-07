import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Nav from '../../components/layout/Nav'
import Timeline from './Timeline'
import PropTypes from 'prop-types'
import useAuthContext from '../../hooks/context/useAuthContext'
import {
  createCustomDataSource,
  defaultCampus,
  getActiveYear,
  sortAlphabetically
} from '../../utils/helpers'
import { campuses, filterCampusLocations, filterCampusRooms, rooms } from '../../data/locationsData'
import FilterTimelineLocations from './FilterTimelineLocations'
import { useParams, useLocation } from 'react-router-dom'
import {
  findCollisionsBetweenAllEvents,
  findCollisionsBetweenUserPlanAndPublicPlans
} from '../../utils/collisionHandling'
import Comment from '../../components/Comment'
import usePlansContext from '../../hooks/context/usePlansContext'
import { getAdminSettings } from '../../firebase/dbActions'
import Error from '../../components/Error'
import { adminError } from '../../CONSTANTS'
import useGetPlans from '../../hooks/plan/useGetPlans'

const allRoomsSorted = sortAlphabetically(rooms)

const CalendarView = ({ findCollisions = false, showAllEvents = false }) => {
  const { id, year } = useParams()
  const { user } = useAuthContext()
  const {
    dispatch,
    admin: { lockPlans },
    plans
  } = usePlansContext()
  const { getUserPlans } = useGetPlans(parseInt(year))
  const [currentLocation, setCurrentLocation] = useState()
  const [currentRoom, setCurrentRoom] = useState()
  const [campus, setCampus] = useState(defaultCampus(user.committeeId))
  const [filteredRooms, setFilteredRooms] = useState(filterCampusRooms(campus.label))
  const [locations, setLocations] = useState(
    sortAlphabetically(Object.values(filterCampusLocations(campus.label)))
  )

  useEffect(() => {
    const getAdminData = async () => {
      const admin = await getAdminSettings()
      dispatch({
        type: 'ADD_ADMIN_SETTINGS',
        payload: { admin }
      })
    }
    getAdminData()
  }, [!lockPlans])

  useEffect(() => {
    if (!plans) getUserPlans()
  }, [])
  
  const planIsLocked = lockPlans && !showAllEvents && !findCollisions

  const planIsOld =
    plans &&
    plans.find((plan) => plan.id === id) &&
    plans.find((plan) => plan.id === id).year !== getActiveYear()

  const planCanBeEdited = plans && !planIsLocked && !planIsOld

  const getDataSource = () => {
    if (findCollisions) {
      const findAllCollisions = useLocation().pathname.includes('all')
      return findAllCollisions
        ? createCustomDataSource(id, { load: true }, findCollisionsBetweenAllEvents)
        : createCustomDataSource(id, { load: true }, findCollisionsBetweenUserPlanAndPublicPlans)
    }

    if (showAllEvents) {
      return createCustomDataSource(id, {
        load: true,
        insert: false, // To work the insert functions needs to be updated, uses the currentUser instead of the owner of the plan
        remove: true,
        update: true
      })
    }

    if (planIsLocked || planIsOld) {
      return createCustomDataSource(user, {
        load: true,
        insert: false,
        remove: false,
        update: false
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
      {plans && (
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
            <Comment>
              Tips!
              <br />
              - Du måste välja en plats i dropdownmenyn för att kunna skapa event.
              <br />
              - Håll nere shift och scrolla for att scrolla i sidled.
              <br />
            </Comment>
            {planIsLocked && <Error message={adminError} />}
            {planIsOld && <Error message="Du kan inte redigera en gammal planering" />}
          </Grid>
          <Grid item xs={10}>
            <Timeline
              currentLocation={currentLocation}
              store={getDataSource()}
              rooms={filteredRooms}
              locations={locations}
              setRooms={setFilteredRooms}
              showCommittee={findCollisions || showAllEvents}
              edit={planCanBeEdited}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  )
}

CalendarView.propTypes = {
  findCollisions: PropTypes.bool,
  showAllEvents: PropTypes.bool
}

export default CalendarView
