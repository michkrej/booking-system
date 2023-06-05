import PropTypes from 'prop-types'
import { Typography } from '@mui/material'

const Error = ({ message }) => {
  return message ? (
    <Typography variant="subtitle2" sx={{ color: 'red', marginTop: '1rem', alignSelf: 'center' }}>
      {message}
    </Typography>
  ) : null
}

Error.propTypes = {
  message: PropTypes.string
}

export default Error
