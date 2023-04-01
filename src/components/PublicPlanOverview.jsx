import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { Link, useNavigate } from 'react-router-dom'
import usePlansContext from '../hooks/usePlansContext'
import { Button } from '@mui/material'
import { formatCollisions } from '../utils/helpers'
import Comment from './Comment'
import { kårer } from '../data/committees'
import OverviewBlock from './OverviewBlock'

const PublicPlanOverview = () => {
  const { publicPlans = [] } = usePlansContext()
  const navigate = useNavigate()

  const displayPlansList = (plans, kårCommittees) => {
    const kårPlans = plans.filter(
      (plan) =>
        kårCommittees.filter((committee) => {
          return committee.id === plan.committeeId
        }).length > 0
    )
      
    return kårPlans.map((plan) => (
      <ListItem key={plan.id}>
        <Link to={`/booking/${plan.id}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
          <ListItemText>{`${
            kårCommittees.find((committee) => committee.id === plan.committeeId).text
          } - ${plan.label}`}</ListItemText>
        </Link>
      </ListItem>
    ))
  }

  const plansPerKår = Object.entries(kårer).map(([kår, committees]) => ({
    [kår]: displayPlansList(publicPlans, committees)
  }))

  return (
    <OverviewBlock title={'Publika planeringar'}>
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
                <Button fullWidth onClick={() => navigate(`/allEvents/${formatCollisions(plans.map(({key}) => ({ id: key })))}`)}>
                  Se planeringar för fadderier inom {kår}
                </Button>
                <Divider />
              </div>
            )
          } else return null
        })}
      </List>
    </OverviewBlock>
  )
}

export default PublicPlanOverview
