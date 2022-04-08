import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import { Link } from 'react-router-dom'
import usePlansContext from '../hooks/usePlansContext'

const PublicPlanOverview = () => {
  const { publicPlans } = usePlansContext()

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
          Publika planeringar
        </Typography>
        <Divider />
        <List>
          {publicPlans.length === 0 && (
            <p>
              <i>Här kommer det du att hitta andras planeringar när de markerat dem som publika</i>
            </p>
          )}
          {publicPlans
            .sort((a, b) => ('' + a.label).localeCompare(b.label, 'sv', { numeric: true }))
            .map((plan) => {
              return (
                <ListItem key={plan.value}>
                  <Link
                    to={`/booking/${plan.value}`}
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    <ListItemText>{`${plan.committee} - ${plan.label}`}</ListItemText>
                  </Link>
                </ListItem>
              )
            })}
        </List>
      </Box>
    </Paper>
  )
}

export default PublicPlanOverview
