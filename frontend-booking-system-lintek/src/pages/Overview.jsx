import { useEffect, useState } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import Nav from '../components/Nav'
import Export from '../components/Export'
import PlanOverview from '../components/PlanOverview'
import CollisionsOverview from '../components/CollisionsOverview'
import { firestore } from '../firebase/config'

/* const plans = [
  {
    value: 1,
    label: 'Normal-p'
  },
  {
    value: 2,
    label: 'Covid-p'
  }
] */

const Overview = () => {
  const [plans, setPlans] = useState([])

  useEffect(() => {
    const getPlans = async () => {
      firestore
        .collection('plans')
        .where('userId', '==', 'UdNEI3S5q6NZ9ebMUYdQ1B6Mgsg1') //TODO change to varaible
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            console.log('No events to load')
          } else {
            let results = []
            snapshot.docs.forEach((doc) => {
              results.push({ value: doc.id, ...doc.data() })
            })
            setPlans(results)
          }
        })
        .catch((error) => {
          console.log('Error getting documents: ', error)
        })
    }

    getPlans()
  }, [])

  return (
    <Container>
      <Nav />
      <Typography variant="h4" align="center" mt={8}>
        Hej NAME, <br /> välkommen till systemet för bokningsplanering!
      </Typography>
      <Box mt={6}>
        <Grid container maxWidth="xs" spacing={2}>
          <Grid item md={6} xs={12}>
            <PlanOverview plans={plans} />
            <CollisionsOverview plans={plans} />
          </Grid>
          <Grid item md={6} xs={12}>
            <Export plans={plans} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Overview
