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

const findCollisions = (events, personalPlan) => {
  const result = []
  events.forEach((ev1, i) => {
    events.forEach((ev2, y) => {
      if (i !== y) {
        const firstEvent = moment.range(new Date(ev1.startDate), new Date(ev1.endDate))
        const firstRooms = ev1.roomId
        const secondEvent = moment.range(new Date(ev2.startDate), new Date(ev2.endDate))
        const secondRooms = ev2.roomId
        const clashingRooms = firstRooms.some((room) => secondRooms.includes(room))
        if (
          firstEvent.overlaps(secondEvent) &&
          clashingRooms &&
          (ev1.planId === personalPlan || ev2.planId === personalPlan)
        ) {
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
