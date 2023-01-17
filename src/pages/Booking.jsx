import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import SelectInput from '../components/SelectInput'
import Nav from '../components/Nav'
import Timeline from '../components/Timeline'
import CustomStore from 'devextreme/data/custom_store'
import { db } from '../firebase/config'
import {
  query,
  collection,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore'

import useAuthContext from '../hooks/useAuthContext'
import { defaultCampus, sortAlphabetically } from '../utils/helpers'
import { campuses, filterCampusLocations, filterCampusRooms, rooms } from '../data/locationsData'
import { locationsValla } from '../data/campusValla/campusValla'

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
      const q = query(
        collection(db, 'events'),
        where('planId', '==', window.location.pathname.split('/')[2])
      )
      return getDocs(q).then((snapshot) => {
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
    insert: async (values) => {
      const doc = {
        ...values,
        startDate: new Date(values.startDate).toString(),
        endDate: new Date(values.endDate).toString(),
        planId: window.location.pathname.split('/')[2],
        committeeId: user.committeeId
      }
      try {
        await addDoc(collection(db, 'events'), doc)
      } catch (e) {
        console.log(e.message)
      }
      return values
    },
    remove: async (id) => {
      try {
        await deleteDoc(doc(db, 'events', id))
      } catch (e) {
        console.log(e.message)
      }
    },
    update: async (id, values) => {
      try {
        const docRef = doc(db, 'events', id)
        await updateDoc(docRef, {
          ...values
        })
        return docRef
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
  const [campus, setCampus] = useState(defaultCampus(user.committeeId))
  const [filteredRooms, setFilteredRooms] = useState(filterCampusRooms(campus.label))
  const [locations, setLocations] = useState(
    sortAlphabetically(Object.values(filterCampusLocations(campus.label)))
  )

  const handleLocationChange = (selectedOption) => {
    setCurrentLocation(selectedOption)
  }
  const handleRoomChange = (selectedOption) => {
    setCurrentRoom(selectedOption)
  }

  const handleCampusChange = (option) => {
    const val = Object.values(filterCampusLocations(option.label))
    sortAlphabetically(val)
    setLocations(val)
    setCurrentLocation(undefined)
    setCampus(option)
  }

  useEffect(() => {
    const filterRooms = () => {
      if (currentRoom) {
        const temp = sortAlphabetically(
          filterCampusRooms(campus.label).filter(
            (room) =>
              room.text.startsWith(currentRoom.label[0]) && room.locationId === currentLocation.id
          )
        )
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
        const temp = sortAlphabetically(
          filterCampusRooms(campus.label).filter((room) => room.locationId === currentLocation.id)
        )
        setFilteredRooms(temp)
      } else {
        const temp = sortedRooms
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
                options={campuses}
                handleChange={handleCampusChange}
                current={campus}
                placeholder="Campus"
                clearable={false}
              />
            </Item>
            <Item>
              <SelectInput
                options={locations}
                handleChange={handleLocationChange}
                current={currentLocation}
                placeholder="Filtrera på plats"
              />
            </Item>
            {currentLocation && currentLocation.id === locationsValla['C-huset'].id && (
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
            locations={locations}
            setRooms={setFilteredRooms}
            edit
          />
        </Grid>
      </Grid>
    </Container>
  )
}
