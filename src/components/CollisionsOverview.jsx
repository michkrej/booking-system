import { useState } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import SelectInput from './SelectInput'
import SearchIcon from '@mui/icons-material/Search'
import usePlansContext from '../hooks/usePlansContext'
import { useNavigate } from 'react-router-dom'
import { formatCollisions } from '../utils/helpers'
import OverviewBlock from './OverviewBlock'

const CollisionsOverview = () => {
  const [selectedPrivatePlan, setSelectedPrivatePlan] = useState()
  const [selectedPublicPlans, setSelectedPublicPlans] = useState()
  const { plans = [], publicPlans } = usePlansContext()
  const navigate = useNavigate()

  const handleselectedPrivatePlan = (option) => {
    setSelectedPrivatePlan(option)
  }

  const handleSelectedPublicPlans = (selectedOptions) => {
    setSelectedPublicPlans(selectedOptions.length === 0 ? undefined : selectedOptions)
  }

  const hasAllPlansBeenSelected = () =>
    selectedPublicPlans?.some(({ label }) => label === 'Samtliga publika planeringar')

  const isDisabled = !selectedPrivatePlan || !selectedPublicPlans

  return (
    <OverviewBlock title="Hitta krockar">
      <Grid container spacing={2}>
        <Grid item xs={12} mt={2}>
          <SelectInput
            options={plans}
            handleChange={handleselectedPrivatePlan}
            placeholder="Din planering"
            value={selectedPrivatePlan}
          />
        </Grid>
        <Grid item xs={12}>
          <SelectInput
            options={[...publicPlans, { label: 'Samtliga publika planeringar', value: 1 }]}
            handleChange={handleSelectedPublicPlans}
            placeholder="Publika planeringar"
            value={selectedPublicPlans}
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
        onClick={() =>
          navigate(`/collisions/${selectedPrivatePlan.id}${formatCollisions(selectedPublicPlans)}`)
        }
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
        onClick={() =>
          navigate(
            `/collisions/all/${selectedPrivatePlan.id}${formatCollisions(
              hasAllPlansBeenSelected() ? publicPlans : selectedPublicPlans
            )}`
          )
        }
      >
        Hitta alla krockar bland valda fadderier
      </Button>
    </OverviewBlock>
  )
}

export default CollisionsOverview
