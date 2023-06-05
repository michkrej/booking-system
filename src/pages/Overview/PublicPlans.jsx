import { useNavigate } from 'react-router-dom'
import usePlansContext from '../../hooks/context/usePlansContext'
import { Button } from '@mui/material'
import { formatCollisions } from '../../utils/helpers'
import Comment from '../../components/Comment'
import { kårer } from '../../data/committees'
import OverviewBlock from './OverviewBlock'
import PublicPlanList from './PublicPlansList'

const PublicPlans = () => {
  const { publicPlans = [] } = usePlansContext()
  const navigate = useNavigate()

  return (
    <OverviewBlock title={'Publika planeringar'}>
      <Button
        fullWidth
        variant="contained"
        onClick={() => navigate(`/allEvents/${formatCollisions(publicPlans)}`)}
      >
        Se samtliga fadderiers planeringar
      </Button>
      {publicPlans.length < 0 && (
        <Comment align="center">Här kommer det du att se allas publika planeringar</Comment>
      )}
      {Object.entries(kårer).map(([kår, committees]) => (
        <PublicPlanList key={kår} kår={kår} kårCommittees={committees} plans={publicPlans} />
      ))}
    </OverviewBlock>
  )
}

export default PublicPlans
