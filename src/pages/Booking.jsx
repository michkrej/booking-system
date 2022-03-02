import { Suspense, useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import SelectInput from '../components/SelectInput'
import Nav from '../components/Nav'
import Timeline from '../components/Timeline'
import CustomStore from 'devextreme/data/custom_store'
import { firestore } from '../firebase/config'

import { locations, rooms } from '../utils/data'
import useAuthContext from '../hooks/useAuthContext'
import { sortAlphabetically } from '../utils/helpers'

export const sortedLocations = sortAlphabetically(Object.values(locations))
export const sortedRooms = sortAlphabetically(rooms)

const Item = styled('div')(() => ({
  marginBottom: '1em',
  width: '100%'
}))

/**
 * TODO
 * If reading like this gets too expensive: connect to an array
 * instead and then parse and save array to Firebase on button click
 */
const customDataSource = (user) => {
  return new CustomStore({
    key: 'id',
    load: () => {
      return firestore
        .collection('events')
        .where('planId', '==', window.location.pathname.split('/')[2])
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            console.log('No events to load')
            return []
          } else {
            let results = []
            snapshot.docs.forEach((doc) => {
              results.push({ id: doc.id, committeeId: user.committee, ...doc.data() })
            })
            return results
          }
        })
    },
    insert: (values) => {
      const doc = {
        ...values,
        startDate: new Date(values.startDate).toString(),
        endDate: new Date(values.endDate).toString(),
        planId: window.location.pathname.split('/')[2],
        committeeId: user.committeeId
      }
      try {
        firestore.collection('events').add(doc)
      } catch (e) {
        console.log(e.message)
      }
      return values
    },
    remove: (id) => {
      try {
        firestore.collection('events').doc(id).delete()
      } catch (e) {
        console.log(e.message)
      }
    },
    update: (id, values) => {
      try {
        let docRef = firestore.collection('events').doc(id)
        return docRef.update({
          ...values
        })
      } catch (e) {
        console.log(e.message)
      }
    }
  })
}

export default function Booking() {
  const { user } = useAuthContext()
  const [currentLocation, setCurrentLocation] = useState()
  const [currentRoom, setCurrentRoom] = useState()
  const [filteredRooms, setFilteredRooms] = useState(rooms)

  const handleLocationChange = (selectedOption) => {
    setCurrentLocation(selectedOption)
  }
  const handleRoomChange = (selectedOption) => {
    setCurrentRoom(selectedOption)
  }

  

  useEffect(() => {
    const filterRooms = () => {
      if (currentRoom) {
        const temp = sortAlphabetically(rooms.filter(
          (room) =>
            room.text.startsWith(currentRoom.label[0]) && room.locationId === currentLocation.id
        ))
        setFilteredRooms(temp)
      } else {
        const temp = sortedRooms
        setFilteredRooms(temp)
      }
    }

    filterRooms()
  }, [currentRoom])

  useEffect(() => {
    const filterRooms = () => {
      if (currentLocation) {
        const temp = sortAlphabetically(rooms.filter((room) => room.locationId === currentLocation.id))
        setFilteredRooms(temp)
      } else {
        const temp = sortedRooms
        setFilteredRooms(temp)
      }
    }

    filterRooms()
  }, [currentLocation])

  const sortedLocations = Object.values(locations).sort((a, b) => (a.text > b.text ? 1 : (a.text === b.text ? 0 : -1)))

  return (
    <Container maxWidth="false">
      <Nav id="nav" />
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={2}>
          <Stack>
            <Item>
              <SelectInput
                options={sortedLocations}
                handleChange={handleLocationChange}
                current={currentLocation}
                placeholder="Filtrera på plats"
              />
            </Item>
            {currentLocation && (
              <Item>
                <SelectInput
                  options={sortedRooms
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
            store={customDataSource(user)}
            rooms={filteredRooms}
            setRooms={setFilteredRooms}
            edit
          />
        </Grid>
      </Grid>
    </Container>
  )
}
