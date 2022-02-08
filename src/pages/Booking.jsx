import { useEffect, useState } from 'react'
import { Container, Grid, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import SelectInput from '../components/SelectInput'
import Nav from '../components/Nav'
import Timeline from '../components/Timeline'
import Button from '../components/Button'
import CustomStore from 'devextreme/data/custom_store'
import { firestore } from '../firebase/config'

import { locations, rooms } from '../utils/data'
import useAuthContext from '../hooks/useAuthContext'

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
      console.log(doc)
      try {
        firestore.collection('events').add(doc)
      } catch (e) {
        console.log(e)
      }
      return values
    },
    remove: (id) => {
      try {
        firestore.collection('events').doc(id).delete()
      } catch (e) {
        console.log(e)
      }
    },
    update: (id, values) => {
      try {
        let docRef = firestore.collection('events').doc(id)
        return docRef.update({
          ...values
        })
      } catch (e) {
        console.log(e)
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

  const handleClick = () => {
    let res = window.prompt('Vad vill du spara detta som?', '')
    console.log(res)
  }

  useEffect(() => {
    const filterRooms = () => {
      if (currentRoom) {
        const temp = rooms.filter(
          (room) =>
            room.text.startsWith(currentRoom.label[0]) && room.locationId === currentLocation.id
        )
        //temp.sort((a, b) => (a.text > b.text ? 1 : b.text > a.text ? -1 : 0))
        setFilteredRooms(temp)
      } else {
        const temp = rooms
        //temp.sort((a, b) => (a.text > b.text ? 1 : b.text > a.text ? -1 : 0))
        setFilteredRooms(temp)
      }
    }

    filterRooms()
  }, [currentRoom])

  useEffect(() => {
    const filterRooms = () => {
      if (currentLocation) {
        const temp = rooms.filter((room) => room.locationId === currentLocation.id)
        //temp.sort((a, b) => (a.text > b.text ? 1 : b.text > a.text ? -1 : 0))
        setFilteredRooms(temp)
      } else {
        const temp = rooms
        //temp.sort((a, b) => (a.text > b.text ? 1 : b.text > a.text ? -1 : 0))
        setFilteredRooms(temp)
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
                options={locations}
                handleChange={handleLocationChange}
                current={currentLocation}
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
