import { useEffect, useState } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import Nav from '../components/Nav'
import Export from '../components/Export'
import PlanOverview from '../components/PlanOverview'
import CollisionsOverview from '../components/CollisionsOverview'
import { firestore } from '../firebase/config'
import useAuthContext from '../hooks/useAuthContext'
import usePlansContext from '../hooks/usePlansContext'

const Overview = () => {
  const [isPending, setIsPending] = useState(true)
  const { user, authFinished } = useAuthContext()
  const { dispatch } = usePlansContext()

  useEffect(() => {
    const getPlans = async () => {
      setIsPending(true)
      try {
        const ref = firestore.collection('plans')
        const snapshotPersonal = await ref.where('userId', '==', user.uid).get()
        const snapshotPublic = await ref
          .where('userId', '!=', user.uid)
          .where('public', '==', true)
          .get()
        const personalPlans = snapshotPersonal.docs.map((doc) => ({ value: doc.id, ...doc.data() }))
        const publicPlans = snapshotPublic.docs.map((doc) => ({ value: doc.id, ...doc.data() }))
        dispatch({
          type: 'LOAD',
          payload: { plans: personalPlans, publicPlans: publicPlans }
        })
        setIsPending(false)
      } catch (error) {
        console.log(error)
        setIsPending(false)
      }
    }
    getPlans()
  }, [])

  console.log(authFinished)

  return (
    <Container>
      <Nav />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {authFinished && (
          <>
            <Typography variant="h4" align="center" mt={8}>
              Hej {user.displayName}, <br /> välkommen till systemet för bokningsplanering!
            </Typography>
            <Box mt={6}>
              <Grid container maxWidth="xs" spacing={2}>
                <Grid item md={6} xs={12}>
                  <PlanOverview userId={user.uid} />
                  <CollisionsOverview />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Export />
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </Container>
  )
}

export default Overview
