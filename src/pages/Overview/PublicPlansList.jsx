import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { formatCollisions } from '../../utils/helpers'
import { Button, List } from '@mui/material'
import Comment from '../../components/Comment'
import PublicPlanListElement from './PublicPlansListElement'

const PublicPlanList = ({ kår, kårCommittees, plans }) => {
  const navigate = useNavigate()

  const kårPlans = plans.filter(
    (plan) =>
      kårCommittees.filter((committee) => {
        return committee.id === plan.committeeId
      }).length > 0
  )

  // Sort plans based on name of committee
  kårPlans.sort((a, b) => {
    // If the name starts with 'Övriga' it should be last
    const committeeA = kårCommittees.find((committee) => committee.id === a.committeeId)
    const committeeB = kårCommittees.find((committee) => committee.id === b.committeeId)

    // If the name starts with 'Övriga' it should be last, otherwise sort alphabetically
    if (committeeA.text.startsWith('Övriga') | committeeB.text.startsWith('Övriga')) {
      return -1
    }

    if (committeeA.text < committeeB.text) {
      return -1
    }
    if (committeeA.text > committeeB.text) {
      return 1
    }
    return 0
  })

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        disabled={kårPlans.length === 0}
        onClick={() =>
          navigate(`/allEvents/${formatCollisions(kårPlans.map(({ key }) => ({ id: key })))}`)
        }
      >
        Se alla planeringar
      </Button>
      <List>
        {kårPlans.length === 0 && (
          <Comment align="center">Inga publika planeringar för {kår}</Comment>
        )}
        {kårPlans.map((plan) => (
          <PublicPlanListElement key={plan.id} kårCommittees={kårCommittees} plan={plan} />
        ))}
      </List>
    </>
  )
}

PublicPlanList.propTypes = {
  kår: PropTypes.string.isRequired,
  kårCommittees: PropTypes.array.isRequired,
  plans: PropTypes.array.isRequired
}

export default PublicPlanList
