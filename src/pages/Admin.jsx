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
import { getAllPlans, getUserAndPublicPlans } from '../firebase/dbActions'

const Admin = () => {
  const [isPending, setIsPending] = useState(true)
  const [plans, setPlans] = useState()
  const { user } = useAuthContext()
  const { dispatch } = usePlansContext()

  useEffect(() => {
    const getPlans = async () => {
      setIsPending(true)
      const plans = await getAllPlans()
      setPlans(plans)
      dispatch({
        type: 'LOAD',
        payload: { plans }
      })
      setIsPending(false)
    }

    getPlans()
  }, [])

  console.log(plans)

  return (
    <Container maxWidth="xl">
      <Nav />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <>
          <Typography variant="h4" align="center" mt={8}>
            Hej {user.displayName}, <br /> välkommen till systemet för bokningsplanering!
          </Typography>
          <Box mt={6}>
            <PlanOverview />
          </Box>
        </>
      </Box>
    </Container>
  )
}

export default Admin
