import { useState } from 'react'
import { Button, Box, Typography, Paper, Grid, Divider } from '@mui/material'
import SelectInput from './SelectInput'
import SearchIcon from '@mui/icons-material/Search'
import usePlansContext from '../hooks/usePlansContext'
import { useNavigate } from 'react-router-dom'

const CollisionsOverview = () => {
  const [startCollision, setStartCollison] = useState('')
  const [endCollision, setEndCollision] = useState('')
  const { plans, publicPlans } = usePlansContext()
  const navigate = useNavigate()

  const handleStartCollison = (option) => {
    setStartCollison(option)
  }
  const handleEndCollision = (option) => {
    setEndCollision(option)
  }

  const formatCollisions = () => {
    let res = ''
    endCollision.forEach((collision) => (res += `+${collision.value}`))
    return res
  }

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Box>
        <Typography variant="h6">Hitta krockar</Typography>
        <Divider />
        <Box component="form">
          <Grid container spacing={2}>
            <Grid item xs={12} mt={2}>
              <SelectInput
                options={plans}
                handleChange={handleStartCollison}
                placeholder="Din plan"
                value={startCollision}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectInput
                options={publicPlans}
                handleChange={handleEndCollision}
                placeholder="Publika planer"
                value={endCollision}
                multiple={true}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            startIcon={<SearchIcon />}
            onClick={() => navigate(`/collisions/${startCollision.value}${formatCollisions()}`)}
          >
            Hitta
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default CollisionsOverview
