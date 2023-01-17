import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Nav from '../components/Nav'
import Export from '../components/Export'
import PlanOverview from '../components/PlanOverview'
import CollisionsOverview from '../components/CollisionsOverview'
import { db } from '../firebase/config'
import { collection, where, getDocs } from 'firebase/firestore'
import useAuthContext from '../hooks/useAuthContext'
import usePlansContext from '../hooks/usePlansContext'
import PublicPlanOverview from '../components/PublicPlanOverview'
import CircularProgress from '@mui/material/CircularProgress'
import { committees } from '../data/committees'
import { getContentById } from '../utils/helpers'

const Overview = () => {
  const [isPending, setIsPending] = useState(true)
  const { user } = useAuthContext()
  const { dispatch, plans } = usePlansContext()

  useEffect(() => {
    const getPlans = async () => {
      setIsPending(true)
      try {
        const ref = collection(db, 'plans')
        // use Promise.all to fetch personal and public plans simultaneously
        const [snapshotPersonal, snapshotPublic] = await Promise.all([
          getDocs(ref, where('userId', '==', user.uid)),
          getDocs(ref, where('userId', '!=', user.uid), where('public', '==', true))
        ])
        const personalPlans = snapshotPersonal.docs.map((doc) => ({ value: doc.id, ...doc.data() }))
        let publicPlans = snapshotPublic.docs.map((doc) => ({ value: doc.id, ...doc.data() }))

        /* 
          Rewrite this whole thing to so that the commitee is instead saved when setting a plan to public.  
        */
        // get Committees
        if (publicPlans.length > 0) {
          const userIds = [...new Set(publicPlans.map((plan) => plan.userId))]
          const res = await getContentById(userIds, 'userDetails', 'userId')
          const dataRes = res.map((elem) => {
            const committee = committees.find((com) => com.id === elem.committeeId)
            return { name: committee.text, userId: elem.userId }
          })
          publicPlans = publicPlans.map((plan) => ({
            ...plan,
            committee: dataRes.find((com) => com.userId === plan.userId).name
          }))
        }
        publicPlans.sort((a, b) => a.committee - b.committee)
        dispatch({
          type: 'LOAD',
          payload: { plans: personalPlans, publicPlans: publicPlans }
        })
        setIsPending(false)
      } catch (error) {
        console.log(error.message)
        setIsPending(false)
      }
    }
    getPlans()
  }, [])

  return (
    <Container maxWidth="xl">
      <Nav />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <>
          <Typography variant="h4" align="center" mt={8}>
            Hej {user.displayName}, <br /> välkommen till systemet för bokningsplanering!
          </Typography>
          <Box mt={6}>
            {isPending && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            )}
            {!isPending && plans && (
              <Grid container maxWidth="xs" spacing={2}>
                <Grid item md={6} xs={12}>
                  <PlanOverview userId={user.uid} />
                  <CollisionsOverview />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Export />
                  <PublicPlanOverview />
                </Grid>
              </Grid>
            )}
          </Box>
        </>
      </Box>
    </Container>
  )
}

export default Overview
