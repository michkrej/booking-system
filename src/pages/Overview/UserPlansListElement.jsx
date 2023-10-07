import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import PublicIcon from '@mui/icons-material/Public'
import EditIcon from '@mui/icons-material/Edit'
import { color } from '../../CONSTANTS'

const UserPlansListElement = (props) => {
  const { plan, lockPlans, changeName, togglePublic, deletePlan } = props

  return (
    <div>
      <ListItem
        key={plan.id}
        secondaryAction={
          <>
            {changeName && (
              <IconButton
                edge="end"
                aria-label="edit name"
                onClick={() => changeName(plan)}
                disabled={lockPlans}
              >
                <EditIcon />
              </IconButton>
            )}
            {togglePublic && (
              <IconButton
                edge="end"
                aria-label="toogle public"
                disabled={lockPlans}
                onClick={() => togglePublic(plan)}
                sx={{ color: plan.public ? color.secondary : color.tertiary, paddingLeft: 2 }}
              >
                <PublicIcon />
              </IconButton>
            )}
            {deletePlan && (
              <IconButton
                edge="end"
                aria-label="delete"
                disabled={lockPlans}
                onClick={() => deletePlan(plan.id)}
                sx={{ paddingLeft: 2 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </>
        }
      >
        <Link
          to={`/booking/${plan.id}/${plan.year}`}
          style={{ color: 'inherit', textDecoration: 'inherit' }}
        >
          <ListItemText>{plan.label}</ListItemText>
        </Link>
      </ListItem>
    </div>
  )
}

UserPlansListElement.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    public: PropTypes.bool,
    year: PropTypes.number
  }),
  lockPlans: PropTypes.bool,
  changeName: PropTypes.func,
  togglePublic: PropTypes.func,
  deletePlan: PropTypes.func
}

export default UserPlansListElement
