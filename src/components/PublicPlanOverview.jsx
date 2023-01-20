import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import { Link, useNavigate } from 'react-router-dom'
import usePlansContext from '../hooks/usePlansContext'
import { Button } from '@mui/material'
import { formatCollisions } from '../utils/helpers'
import Comment from './Comment'
import { kårer } from '../data/committees'

const PublicPlanOverview = () => {
  const { publicPlans = [] } = usePlansContext()
  const navigate = useNavigate()

  const displayPlansList = (plans, kårCommittees) => {
    const kårPlans = plans.filter(
      (plan) =>
        kårCommittees.filter((committee) => {
          return committee.text === plan.committee
        }).length > 0
    )

    return kårPlans.map((plan) => (
      <ListItem key={plan.id}>
        <Link to={`/booking/${plan.id}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
          <ListItemText>{`${plan.committee} - ${plan.label}`}</ListItemText>
        </Link>
      </ListItem>
    ))
  }

  const plansPerKår = Object.entries(kårer).map(([kår, committees]) => ({
    [kår]: displayPlansList(publicPlans, committees)
  }))

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
          Publika planeringar
        </Typography>
        <Divider />
        <Button fullWidth onClick={() => navigate(`/allEvents/${formatCollisions(publicPlans)}`)}>
          Se samtliga fadderiers planeringar
        </Button>
        <Divider />
        {!publicPlans.length > 0 && (
          <Comment align="center">Här kommer det du att se allas publika planeringar</Comment>
        )}
        <List>
          {plansPerKår.map((kårData, i) => {
            const [kår, plans] = Object.entries(kårData)[0]
            if (plans.length > 0) {
              return (
                <div key={i}>
                  {plans}
                  <Divider />
                  <Button
                    fullWidth
                    onClick={() => navigate(`/allEvents/${formatCollisions(plans)}`)}
                  >
                    Se planeringar för fadderier inom {kår}
                  </Button>
                  <Divider />
                </div>
              )
            } else return null
          })}
        </List>
      </Box>
    </Paper>
  )
}

export default PublicPlanOverview
