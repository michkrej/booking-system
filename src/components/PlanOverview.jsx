import { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import List from '@mui/material/List'
import AddIcon from '@mui/icons-material/Add'
import LoadingButton from '@mui/lab/LoadingButton'
import usePlansContext from '../hooks/usePlansContext'
import useAuthContext from '../hooks/useAuthContext'
import { createPlan, deletePlan, updatePlan } from '../firebase/dbActions'
import { sortAlphabetically } from '../utils/helpers'
import Error from './Error'
import OverviewBlock from './OverviewBlock'
import PlanListElement from './PlanListElement'

export const adminError = 'Möjligheten att redigera planeringar har låsts av en administratör'

const PlanOverview = () => {
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState()
  const {
    plans = [],
    dispatch,
    admin: { lockPlans }
  } = usePlansContext()

  const createNewPlan = async () => {
    setError(undefined)
    if (lockPlans) return
    setIsPending(true)
    const name = window.prompt('Vad ska din ny planering heta?')
    if (name.length < 1) {
      setError('Du måste ange ett namn')
    } else {
      const planFields = {
        label: name,
        userId: user.uid,
        public: false,
        committeeId: user.committeeId
      }
      const { id } = await createPlan(planFields)
      navigate(`/booking/${id}`)
      dispatch({
        type: 'CREATE',
        payload: {
          id,
          ...planFields
        }
      })
    }
    setIsPending(false)
  }

  const deleteUserPlan = (planId) => {
    if (lockPlans) return
    if (confirm(`Vill du verkligen radera '${plans.find((plan) => plan.id === planId).label}'`)) {
      deletePlan(planId)
      dispatch({
        type: 'DELETE',
        payload: {
          id: planId
        }
      })
    }
  }

  const togglePublic = (plan) => {
    setError(undefined)
    if (lockPlans) return
    const hasPublicPlan = plans.some((plan) => plan.public)
    if (!plan.public && hasPublicPlan) {
      setError('Du kan bara ha en publik planering åt gången')
    } else {
      const _public = !plan.public
      const addCommittee = plan.committeeId ? {} : { committeeId: user.committeeId } // adding committee here in case it is an old plan
      updatePlan(plan.id, { public: _public, ...addCommittee })
      dispatch({
        type: 'UPDATE_PUBLIC',
        payload: {
          ...plan,
          public: _public,
          ...addCommittee
        }
      })
    }
  }

  const changeName = (plan) => {
    setIsPending(true)
    setError(undefined)
    const label = window.prompt('Vad ska din planering byta namn till?')
    if (label.length < 1) {
      setError('Du måste ange ett namn')
    } else {
      updatePlan(plan.id, { ...plan, label })
      dispatch({
        type: 'UPDATE',
        payload: {
          ...plan,
          label
        }
      })
    }
    setIsPending(false)
  }

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
        {sortAlphabetically(plans, true).map((plan) => {
          return (
            <PlanListElement
              key={plan.id}
              plan={plan}
              togglePublic={togglePublic}
              changeName={changeName}
              deleteUserPlan={deleteUserPlan}
            />
          )
        })}
      </List>
      <LoadingButton
        onClick={createNewPlan}
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
