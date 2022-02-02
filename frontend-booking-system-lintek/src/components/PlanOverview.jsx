import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Paper,
  Divider
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { Link } from 'react-router-dom'
import { firestore } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import usePlansContext from '../hooks/usePlansContext'

const PlanOverview = ({ userId }) => {
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const { plans = [], dispatch } = usePlansContext()

  const createNewPlan = async () => {
    const name = window.prompt('Vad ska din ny plan heta?')
    setIsPending(true)
    try {
      const res = await firestore.collection('plans').add({ label: name, userId, public: false })
      navigate(`/booking/${res.id}`)
      setIsPending(false)
    } catch (e) {
      console.log(e)
      setIsPending(false)
    }
  }

  const deletePlan = async (planValue) => {
    try {
      await firestore.collection('plans').doc(planValue).delete()
      dispatch({
        type: 'DELETE',
        payload: {
          value: planValue
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const togglePublic = async (plan) => {
    try {
      const newState = !plan.public
      dispatch({
        type: 'UPDATE',
        payload: { ...plan, public: newState }
      })
      await firestore.collection('plans').doc(plan.value).update({ public: newState })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6">Planeringar</Typography>
        <Divider />
        <List>
          {plans.map((plan) => {
            return (
              <ListItem
                key={plan.value}
                secondaryAction={
                  <>
                    <Checkbox
                      edge="end"
                      onChange={() => togglePublic(plan)}
                      checked={plan.public}
                    />
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deletePlan(plan.value)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <Link
                  to={`/booking/${plan.value}`}
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
          fullWidth
        >
          Skapa ny
        </LoadingButton>
      </Box>
    </Paper>
  )
}

PlanOverview.propTypes = {
  userId: PropTypes.string
}

export default PlanOverview
