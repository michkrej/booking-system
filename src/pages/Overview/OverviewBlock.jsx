import PropTypes from 'prop-types'

import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

import Comment from '../../components/Comment'

const OverviewBlock = ({ title, comment, children, variant = 'elevation', elevation = 5 }) => {
  return (
    <Paper sx={{ padding: 2, marginBlock: 2 }} variant={variant} elevation={elevation}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Divider sx={{ marginBottom: 1 }} />
        {comment && (
          <div>
            <Comment>{comment}</Comment>
            <Divider />
          </div>
        )}
        {children}
      </Box>
    </Paper>
  )
}

OverviewBlock.propTypes = {
  title: PropTypes.string.isRequired,
  comment: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  variant: PropTypes.string,
  elevation: PropTypes.number
}

export default OverviewBlock
