import { useState } from 'react'
import { Container, Grid, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import SelectInput from '../components/SelectInput'
import Nav from '../components/Nav'
import Timeline from '../components/Timeline'
import CustomStore from 'devextreme/data/custom_store'
import { firestore } from '../firebase/config'
import { locations } from '../utils/data'
import { useParams } from 'react-router-dom'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

const Item = styled('div')(() => ({
  marginBottom: '1em',
  width: '100%'
}))

const findCollisions = (array) => {
  const test = []

  array.forEach((elem, i) => {
    array.forEach((s, y) => {
      if (i !== y) {
        const first = moment.range(new Date(elem.startDate), new Date(elem.endDate))
        const firstRooms = elem.roomId
        const second = moment.range(new Date(s.startDate), new Date(s.endDate))
        const secondRooms = s.roomId

        const clashingRooms = firstRooms.some((room) => secondRooms.includes(room))
        if (first.overlaps(second) && clashingRooms) {
          test.push(elem)
        }
      }
    })
  })
  return test
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

            return findCollisions(results)
          }
        })
    }
  })
}

export default function Collisions() {
  const [currentLocation, setCurrentLocation] = useState()
  const { id } = useParams()

  const handleChange = (selectedOption) => {
    setCurrentLocation(selectedOption)
  }

  return (
    <Container maxWidth="false">
      <Nav id="nav" />
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={2}>
          <Stack>
            <Item>
              <SelectInput
                options={locations}
                handleChange={handleChange}
                current={currentLocation}
                placeholder="Filtrera på plats"
              />
            </Item>
          </Stack>
        </Grid>
        <Grid item xs={10}>
          <Timeline currentLocation={currentLocation} store={customDataSource(id)} showCommittee />
        </Grid>
      </Grid>
    </Container>
  )
}
