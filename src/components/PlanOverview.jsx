import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import PublicIcon from '@mui/icons-material/Public'
import EditIcon from '@mui/icons-material/Edit'
import LoadingButton from '@mui/lab/LoadingButton'
import usePlansContext from '../hooks/usePlansContext'
import useAuthContext from '../hooks/useAuthContext'
import { createPlan, deletePlan, updatePlan } from '../firebase/dbActions'
import { sortAlphabetically } from '../utils/helpers'
import Error from './Error'
import { secondary, secondary2 } from '../App'
import OverviewBlock from './OverviewBlock'

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
      {error && <Error message={error} />}
      <List>
        {sortAlphabetically(plans, true).map((plan) => {
          return (
            <ListItem
              key={plan.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit name" onClick={() => changeName(plan)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="toogle public"
                    onClick={() => togglePublic(plan)}
                    sx={{ color: plan.public ? secondary : secondary2, paddingLeft: 2 }}
                  >
                    <PublicIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteUserPlan(plan.id)}
                    sx={{ paddingLeft: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <Link
                to={`/booking/${plan.id}`}
                style={{ color: 'inherit', textDecoration: 'inherit' }}
              >
                <ListItemText>{plan.label}</ListItemText>
              </Link>
            </ListItem>
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
