import PropTypes from 'prop-types'
import { Typography } from '@mui/material'

const Error = ({ message }) => {
  return (
    <Typography variant="subtitle2" sx={{ color: 'red', marginTop: '1rem', alignSelf: 'center' }}>
      {message}
    </Typography>
  )
}

Error.propTypes = {
  message: PropTypes.string.isRequired
}

export default Error
