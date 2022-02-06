import { useState } from 'react'
import { Container, Grid, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import SelectInput from '../components/SelectInput'
import Nav from '../components/Nav'
import Timeline from '../components/Timeline'
import Button from '../components/Button'
import CustomStore from 'devextreme/data/custom_store'
import { firestore } from '../firebase/config'

import { locations } from '../utils/data'
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
  const [currentLocation, setCurrentLocation] = useState()
  const { user } = useAuthContext()
  const handleChange = (selectedOption) => {
    setCurrentLocation(selectedOption)
  }
  const handleClick = () => {
    let res = window.prompt('Vad vill du spara detta som?', '')
    console.log(res)
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
            <Item>
              <Button variant="contained" handleClick={handleClick}>
                Spara
              </Button>
            </Item>
          </Stack>
        </Grid>
        <Grid item xs={10}>
          <Timeline currentLocation={currentLocation} store={customDataSource(user)} edit />
        </Grid>
      </Grid>
    </Container>
  )
}
