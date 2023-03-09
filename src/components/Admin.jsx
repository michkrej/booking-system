import { Grid, Switch } from '@mui/material'
import Comment from './Comment'
import OverviewBlock from './OverviewBlock'

const AdminOverview = () => {
  return (
    <OverviewBlock title="Admin">
      <Grid container>
        <Grid item mt={1}>
          <div>
            <Switch /> Lås planeringar
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
