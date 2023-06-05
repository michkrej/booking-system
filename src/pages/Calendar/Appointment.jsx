import { formatDate } from 'devextreme/localization'
import PropTypes from 'prop-types'
import { committees } from '../../data/committees'

const Appointment = ({ targetedAppointmentData }) => {
  return (
    <div>
      <div style={{ fontSize: '0.9em' }}>
        <b>{targetedAppointmentData.text}</b>
      </div>
      <div style={{ fontSize: '0.8em' }}>
        {committees.find((com) => com.id === targetedAppointmentData.committeeId).text}
      </div>
      <div style={{ fontSize: '0.8em' }}>
        {formatDate(targetedAppointmentData.displayStartDate, 'shortTime')}
        {' - '}
        {formatDate(targetedAppointmentData.displayEndDate, 'shortTime')}
      </div>
    </div>
  )
}

Appointment.propTypes = {
  targetedAppointmentData: PropTypes.shape({
    text: PropTypes.string,
    committeeId: PropTypes.string,
    displayStartDate: PropTypes.instanceOf(Date),
    displayEndDate: PropTypes.instanceOf(Date)
  })
}

export default Appointment
