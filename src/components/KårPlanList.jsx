import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { formatCollisions } from '../utils/helpers'
import { Button, List } from '@mui/material'
import KårPlan from './KårPlan'
import Comment from './Comment'

const KårPlanList = ({ kår, kårCommittees, plans }) => {
  const navigate = useNavigate()

  const kårPlans = plans.filter(
    (plan) =>
      kårCommittees.filter((committee) => {
        return committee.id === plan.committeeId
      }).length > 0
  )

  return (
    <List>
      <Button
        fullWidth
        variant="contained"
        disabled={kårPlans.length === 0}
        onClick={() =>
          navigate(`/allEvents/${formatCollisions(kårPlans.map(({ key }) => ({ id: key })))}`)
        }
      >
        Se planeringar för fadderier inom {kår}
      </Button>
      {kårPlans.length === 0 && (
        <Comment align="center">Inga publika planeringar för {kår}</Comment>
      )}
      {kårPlans.map((plan) => (
        <KårPlan key={plan.id} kårCommittees={kårCommittees} plan={plan} />
      ))}
    </List>
  )
}

KårPlanList.propTypes = {
  kår: PropTypes.string.isRequired,
  kårCommittees: PropTypes.array.isRequired,
  plans: PropTypes.array.isRequired
}

export default KårPlanList
