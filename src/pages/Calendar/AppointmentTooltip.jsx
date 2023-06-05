import { Grid } from '@mui/material'
import { formatDate } from 'devextreme/localization'
import PropTypes from 'prop-types'

const AppointmentTooltip = ({ targetedAppointmentData }) => {
  return (
    <Grid sx={{ textAlign: 'left', width: '60%', marginLeft: '1em' }}>
      <Grid item>
        <b>{targetedAppointmentData.text}</b>
      </Grid>
      <Grid item sx={{ fontSize: '0.8em' }}>
        {formatDate(targetedAppointmentData.displayStartDate, 'shortTime')}
        {' - '}
        {formatDate(targetedAppointmentData.displayEndDate, 'shortTime')}
      </Grid>
      <div style={{ display: 'flex', fontSize: '0.8em' }}>
        <Grid item xs={6}>
          <div>Kårallen</div>
          <div style={{ marginLeft: '1em' }}>
            {targetedAppointmentData?.grillar && (
              <div>Grillar: {targetedAppointmentData?.grillar ?? 0}</div>
            )}
            {targetedAppointmentData?.['bankset-k'] && (
              <div>Bänkset: {targetedAppointmentData?.['bankset-k'] ?? 0}</div>
            )}
            {targetedAppointmentData?.bardiskar && (
              <div>Bardiskar: {targetedAppointmentData?.bardiskar ?? 0}</div>
            )}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>HG</div>
          <div style={{ marginLeft: '1em' }}>
            {targetedAppointmentData?.['bankset-HG'] && (
              <div>Bänkset: {targetedAppointmentData?.['bankset-HG'] ?? 0}</div>
            )}
          </div>
        </Grid>
      </div>
    </Grid>
  )
}

AppointmentTooltip.propTypes = {
  targetedAppointmentData: PropTypes.shape({
    text: PropTypes.string,
    committeeId: PropTypes.string,
    displayStartDate: PropTypes.instanceOf(Date),
    displayEndDate: PropTypes.instanceOf(Date),
    grillar: PropTypes.number,
    'bankset-k': PropTypes.number,
    'bankset-HG': PropTypes.number,
    bardiskar: PropTypes.number
  }).isRequired
}

export default AppointmentTooltip
