import { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import SelectInput from './SelectInput'
import SearchIcon from '@mui/icons-material/Search'
import usePlansContext from '../hooks/usePlansContext'
import { useNavigate } from 'react-router-dom'
import { formatCollisions } from '../utils/helpers'

const CollisionsOverview = () => {
  const [startCollision, setStartCollision] = useState()
  const [endCollision, setEndCollision] = useState()
  const { plans = [], publicPlans } = usePlansContext()
  const navigate = useNavigate()

  const handleStartCollision = (option) => {
    setStartCollision(option)
  }

  const handleEndCollision = (option) => {
    setEndCollision(option.length === 0 ? undefined : option)
  }

  const isDisabled = !startCollision || !endCollision
  const collisionPath = formatCollisions(endCollision)

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
          Hitta krockar
        </Typography>
        <Divider />
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} mt={2}>
              <SelectInput
                options={plans}
                handleChange={handleStartCollision}
                placeholder="Din planering"
                value={startCollision}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectInput
                options={publicPlans}
                handleChange={handleEndCollision}
                placeholder="Publika planeringar"
                value={endCollision}
                multiple={true}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
            startIcon={<SearchIcon />}
            disabled={isDisabled}
            onClick={() => navigate(`/collisions/${startCollision.value}${collisionPath}`)}
          >
            Hitta endast dina krockar med valda fadderier
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mb: 2 }}
            startIcon={<SearchIcon />}
            disabled={isDisabled}
            onClick={() => navigate(`/collisions/all/${startCollision.value}${collisionPath}`)}
          >
            Hitta alla krockar bland valda fadderier
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}


export default CollisionsOverview
