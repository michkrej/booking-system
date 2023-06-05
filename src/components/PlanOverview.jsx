import PropTypes from 'prop-types'
import List from '@mui/material/List'
import AddIcon from '@mui/icons-material/Add'
import LoadingButton from '@mui/lab/LoadingButton'
import usePlansContext from '../hooks/usePlansContext'
import { sortAlphabetically } from '../utils/helpers'
import Error from './Error'
import OverviewBlock from './OverviewBlock'
import PlanListElement from './PlanListElement'
import useEditPlan from '../hooks/planHooks/useEditPlan'
import { adminError } from '../CONSTANTS'

const PlanOverview = () => {
  const {
    plans = [],
    admin: { lockPlans }
  } = usePlansContext()
  const {
    changePlanName,
    _deletePlan: deletePlan,
    togglePublicPlan,
    createPlan,
    error,
    isPending
  } = useEditPlan()

  const sortedPlans = sortAlphabetically(plans, true)

  return (
    <OverviewBlock
      title="Planeringar"
      comment={`En planering kan ses som en google calender, den kan innehålla en jäkla massa event som
          sker på olika platser. Det behövs endast mer än en planering om du vill flera olika
          versioner eller har kvar planeringar från din företrädare`}
    >
      {lockPlans && <Error message={adminError} />}
      <Error message={error} />
      <List>
        {sortedPlans.map((plan) => {
          return (
            <PlanListElement
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
        onClick={createPlan}
        loading={isPending}
        loadingPosition="start"
        startIcon={<AddIcon />}
        variant="contained"
        disabled={lockPlans}
        fullWidth
      >
        Skapa ny planering
      </LoadingButton>
    </OverviewBlock>
  )
}

PlanOverview.propTypes = {
  userId: PropTypes.string
}

export default PlanOverview
