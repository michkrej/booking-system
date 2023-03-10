import { Grid, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import { getAdminSettings, lockAndUnlockPlans } from '../firebase/dbActions'
import Comment from './Comment'
import OverviewBlock from './OverviewBlock'


/*
* TODO
* 1. PlanOverview is not updated when the toggle is changed 
*/
const AdminOverview = () => {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const getToggleValue = async () => {
      const { lockPlans } = await getAdminSettings(false)
      setChecked(lockPlans)
    }
    getToggleValue()
  }, [])

  const handleChange = (event) => {
    lockAndUnlockPlans(event.target.checked)
    setChecked(event.target.checked)
  }

  return (
    <OverviewBlock title="Admin">
      <Grid container>
        <Grid item mt={1}>
          <div>
            <Switch checked={checked} onChange={handleChange} /> Lås planeringar
            <Comment>
              Ingen kommer kunna byta vilken planering de har publik och de kommer inte kunna
              redigara sina event i planeringen. Du som admin kan fortfarande redigera och ta bort
              event.
            </Comment>
          </div>
        </Grid>
      </Grid>
    </OverviewBlock>
  )
}

export default AdminOverview
