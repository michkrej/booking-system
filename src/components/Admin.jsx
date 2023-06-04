import { Grid, Switch } from '@mui/material'
import Comment from './Comment'
import OverviewBlock from './OverviewBlock'
import useAdminSettings from '../hooks/useAdminSettings'

/*
 * TODO
 * 1. PlanOverview is not updated when the toggle is changed
 */
const AdminOverview = () => {
  const { checked, lockPlans } = useAdminSettings()

  return (
    <OverviewBlock title="Admin">
      <Grid container>
        <Grid item mt={1}>
          <div>
            <Switch checked={checked} onChange={lockPlans} /> Lås planeringar
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
