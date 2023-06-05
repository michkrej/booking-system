import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Nav from '../components/Nav'
import Export from '../components/Export'
import PlanOverview from '../components/PlanOverview'
import CollisionsOverview from '../components/CollisionsOverview'
import useAuthContext from '../hooks/context/useAuthContext'
import PublicPlanOverview from '../components/PublicPlanOverview'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import AdminOverview from '../components/Admin'
import useGetPlans from '../hooks/plan/useGetPlans'
import useChangeUsername from '../hooks/user/useChangeUsername'
import usePlansContext from '../hooks/context/usePlansContext'

const Overview = () => {
  const { user } = useAuthContext()
  const { plans } = usePlansContext()
  const { isPending } = useGetPlans(true)
  const { username, changeUsername } = useChangeUsername()

  return (
    <Container maxWidth="xl">
      <Nav />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <>
          <Typography variant="h4" align="center" mt={8}>
            Hej {username}
            <Box sx={{ display: 'inline' }}>
              <IconButton size="small" onClick={changeUsername} sx={{ marginBottom: 3 }}>
                <EditIcon fontSize="1" />
              </IconButton>
            </Box>
            ,
            <br /> välkommen till systemet för bokningsplanering!
          </Typography>
          <Box mt={4}>
            {isPending ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              plans && (
                <Grid container maxWidth="xs" spacing={2}>
                  <Grid item md={6} xs={12}>
                    {user.admin && <AdminOverview />}
                    <PlanOverview />
                    <CollisionsOverview />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Export />
                    <PublicPlanOverview />
                  </Grid>
                </Grid>
              )
            )}
          </Box>
        </>
      </Box>
    </Container>
  )
}

export default Overview
