import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

const Comment = ({ children: text, align }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Typography
        variant="caption"
        align={align}
        p={1}
        sx={{ color: 'gray', fontStyle: 'italic', width: '100%' }}
      >
        {text}
      </Typography>
    </Box>
  )
}

Comment.propTypes = {
  align: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}

export default Comment
