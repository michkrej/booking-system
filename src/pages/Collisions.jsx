import { useState, useEffect } from 'react'
import { Container, Grid, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import SelectInput from '../components/SelectInput'
import Nav from '../components/Nav'
import Timeline from '../components/Timeline'
import CustomStore from 'devextreme/data/custom_store'
import { firestore } from '../firebase/config'
import { locations, rooms } from '../utils/data'
import { useParams } from 'react-router-dom'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { sortAlphabetically } from '../utils/helpers'
import { sortedLocations } from './Booking'

const moment = extendMoment(Moment)

const Item = styled('div')(() => ({
  marginBottom: '1em',
  width: '100%'
}))

/*
 * TODO: Kunna hantera krockar mellan korridorer och specifika salar.
         Hantera krockar med grillantal 
 */
const findCollisions = (events, personalPlanId) => {
  const result = []
  const personalPlan = events.filter((event) => event.planId === personalPlanId)
  const publicPlans = events.filter((event) => event.planId !== personalPlanId)
  personalPlan.forEach((ev1) => {
    publicPlans.forEach((ev2) => {
      const firstEvent = moment.range(new Date(ev1.startDate), new Date(ev1.endDate))
      const firstRooms = ev1.roomId
      const secondEvent = moment.range(new Date(ev2.startDate), new Date(ev2.endDate))
      const secondRooms = ev2.roomId
      const clashingRooms = firstRooms.some((room) => secondRooms.includes(room))
      if (firstEvent.overlaps(secondEvent) && clashingRooms) {
        result.push(ev2)
        if (!result.includes(ev1)) {
          result.push(ev1)
        }
      }

    })
  })
  return result
}

const customDataSource = (planIds) => {
  return new CustomStore({
    key: 'id',
    load: () => {
      return firestore
        .collection('events')
        .where('planId', 'in', planIds.split('+'))
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            console.log('No events to load')
            return []
          } else {
            let results = []
            snapshot.docs.forEach((doc) => {
              results.push({ id: doc.id, ...doc.data() })
            })

            return findCollisions(results, planIds.split('+')[0])
          }
        })
    }
  })
}

export default function Collisions() {
  const [filteredRooms, setFilteredRooms] = useState(rooms)
  const [currentLocation, setCurrentLocation] = useState()
  const [currentRoom, setCurrentRoom] = useState()
  const { id } = useParams()

  const handleChange = (selectedOption) => {
    setCurrentLocation(selectedOption)
  }

  const handleRoomChange = (selectedOption) => {
    setCurrentRoom(selectedOption)
  }

  useEffect(() => {
    const filterRooms = () => {
      if (currentRoom) {
        const temp = rooms.filter(
          (room) =>
            room.text.startsWith(currentRoom.label[0]) && room.locationId === currentLocation.id
        )
        setFilteredRooms(sortAlphabetically(temp))
      } else {
        const temp = rooms
        setFilteredRooms(sortAlphabetically(temp))
      }
    }

    filterRooms()
  }, [currentRoom])

  /** TODO: This doesnät seem correct - two functions that do the same thing? */
  useEffect(() => {
    const filterRooms = () => {
      if (currentLocation) {
        const tempRooms = rooms.filter((room) => room.locationId === currentLocation.id)
        setFilteredRooms(sortAlphabetically(tempRooms))
      } else {
        const temp = rooms
        setFilteredRooms(sortAlphabetically(temp))
      }
    }

    filterRooms()
  }, [currentLocation])

  return (
    <Container maxWidth="false">
      <Nav id="nav" />
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={2}>
          <Stack>
            <Item>
              <SelectInput
                options={sortedLocations}
                handleChange={handleChange}
                personal={currentLocation}
                placeholder="Filtrera på plats"
              />
            </Item>
            {currentLocation && (
              <Item>
                <SelectInput
                  options={rooms
                    .filter(
                      (room) =>
                        room.text.includes('korridoren') && room.locationId === currentLocation.id
                    )
                    .map(({ id, text }) => ({ value: id, label: text }))}
                  handleChange={handleRoomChange}
                  current={currentRoom}
                  placeholder="Filtrera på del"
                />
              </Item>
            )}
          </Stack>
        </Grid>
        <Grid item xs={10}>
          <Timeline
            currentLocation={currentLocation}
            store={customDataSource(id)}
            rooms={filteredRooms}
            showCommittee
          />
        </Grid>
      </Grid>
    </Container>
  )
}
