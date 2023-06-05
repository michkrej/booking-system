import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

const Success = ({ message }) => {
  return message ? (
    <Typography variant="subtitle2" sx={{ color: 'green', marginTop: '1rem', alignSelf: 'center' }}>
      {message}
    </Typography>
  ) : null
}

Success.propTypes = {
  message: PropTypes.string
}

export default Success
