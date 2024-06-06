import PropTypes from 'prop-types'
import List from '@mui/material/List'
import AddIcon from '@mui/icons-material/Add'
import LoadingButton from '@mui/lab/LoadingButton'
import usePlansContext from '../../hooks/context/usePlansContext'
import { getActiveYear, sortAlphabetically } from '../../utils/helpers'
import Error from '../../components/Error'
import OverviewBlock from './OverviewBlock'
import { adminError } from '../../CONSTANTS'
import UserPlansListElement from './UserPlansListElement'
import useAdminSettings from '../../hooks/useAdminSettings'
import { useEditPlan } from '../../hooks/plan/useEditPlan'

const UserPlans = ({ year }) => {
  const { plans = [] } = usePlansContext()
  const { checked: lockPlans } = useAdminSettings()
  const {
    changePlanName,
    _deletePlan: deletePlan,
    togglePublicPlan,
    createPlan,
    error,
    isPending
  } = useEditPlan()

  const sortedPlans = sortAlphabetically(plans, true)
  const currentYear = getActiveYear()

  return (
    <OverviewBlock
      title="Planeringar"
      comment={`En planering kan ses som en google calender, den kan innehålla en jäkla massa event som
          sker på olika platser. Det behövs endast mer än en planering om du vill flera olika
          versioner.`}
    >
      {lockPlans && <Error message={adminError} />}
      <Error message={error} />
      {year >= currentYear ? (
        <>
          <List>
            {sortedPlans.map((plan) => {
              return (
                <UserPlansListElement
                  key={plan.id}
                  plan={plan}
                  lockPlans={lockPlans}
                  togglePublic={togglePublicPlan}
                  changeName={changePlanName}
                  deletePlan={deletePlan}
                />
              )
            })}
          </List>
          <LoadingButton
            onClick={() => createPlan(year)}
            loading={isPending}
            loadingPosition="start"
            startIcon={<AddIcon />}
            variant="contained"
            disabled={lockPlans}
            fullWidth
          >
            Skapa ny planering
          </LoadingButton>
        </>
      ) : (
        <List>
          {sortedPlans.map((plan) => (
            <UserPlansListElement key={plan.id} plan={plan} />
          ))}
        </List>
      )}
    </OverviewBlock>
  )
}

UserPlans.propTypes = {
  year: PropTypes.number.isRequired
}

export default UserPlans
