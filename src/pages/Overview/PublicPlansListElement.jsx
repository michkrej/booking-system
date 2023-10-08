import PropTypes from 'prop-types'
import { ListItem, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'

const PublicPlanListElement = ({ kårCommittees, plan }) => {

  const committeeName = kårCommittees.find((committee) => committee.id === plan.committeeId).text
  return (
    <ListItem key={plan.id}>
      <Link to={`/booking/${plan.id}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
        <ListItemText>{`${committeeName}
        ${committeeName !== 'Övrigt' ? '' : `- ${plan.label}`}
        `}</ListItemText>
      </Link>
    </ListItem>
  )
}

PublicPlanListElement.propTypes = {
  kårCommittees: PropTypes.array.isRequired,
  plan: PropTypes.object.isRequired
}

export default PublicPlanListElement
