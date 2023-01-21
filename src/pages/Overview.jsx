import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Nav from '../components/Nav'
import Export from '../components/Export'
import PlanOverview from '../components/PlanOverview'
import CollisionsOverview from '../components/CollisionsOverview'
import useAuthContext from '../hooks/useAuthContext'
import usePlansContext from '../hooks/usePlansContext'
import PublicPlanOverview from '../components/PublicPlanOverview'
import CircularProgress from '@mui/material/CircularProgress'
import { getAllPlans } from '../firebase/dbActions'

const Overview = () => {
  const [isPending, setIsPending] = useState(true)
  const { user } = useAuthContext()
  const { dispatch, plans } = usePlansContext()

  useEffect(() => {
    const getPlans = async () => {
      setIsPending(true)
      const { plans: _plans, publicPlans } = await getAllPlans(user)
      dispatch({
        type: 'LOAD',
        payload: { plans: _plans, publicPlans: publicPlans }
      })
      setIsPending(false)
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
                  <PlanOverview />
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
