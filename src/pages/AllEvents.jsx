import { useState, useEffect } from 'react'
import { Container, Grid, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import SelectInput from '../components/SelectInput'
import Nav from '../components/Nav'
import Timeline from '../components/Timeline'
import CustomStore from 'devextreme/data/custom_store'
import { firestore } from '../firebase/config'
import { campuses, filterCampusLocations, locations, rooms } from '../utils/data'
import { useLocation, useMatch, useParams } from 'react-router-dom'
import { defaultCampus, getContentById, sortAlphabetically } from '../utils/helpers'
import useAuthContext from '../hooks/useAuthContext'

export const sortedLocations = sortAlphabetically(Object.values(locations))

const Item = styled('div')(() => ({
  marginBottom: '1em',
  width: '100%'
}))

const customDataSource = (planIds) => {
  return new CustomStore({
    key: 'id',
    load: async () => {
      const res = await getContentById(planIds.split('+'), 'events', 'planId')
      if (res.length < 1) {
        console.log('No events to load')
        return []
      } else {
        return res
      }
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

export default function AllEvents() {
  const { user } = useAuthContext()
  const [filteredRooms, setFilteredRooms] = useState(rooms)
  const [currentLocation, setCurrentLocation] = useState()
  const [currentRoom, setCurrentRoom] = useState()
  const [campus, setCampus] = useState(defaultCampus(user.committeeId))
  const [locations, setLocations] = useState(
    sortAlphabetically(Object.values(filterCampusLocations(campus.label)))
  )

  const { id } = useParams()

  const handleChange = (selectedOption) => {
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
                handleChange={handleChange}
                personal={currentLocation}
                placeholder="Filtrera p?? plats"
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
                  placeholder="Filtrera p?? del"
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
            locations={Object.values(locations)}
            showCommittee
            edit={user.admin ?? false}
          />
        </Grid>
      </Grid>
    </Container>
  )
}
