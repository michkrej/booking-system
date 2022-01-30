import { Button as MuiButton } from '@mui/material'
import PropTypes from 'prop-types'

const Button = ({ variant, handleClick, children }) => {
  return (
    <MuiButton variant={variant} onClick={handleClick}>
      {children}
    </MuiButton>
  )
}

Button.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  handleClick: PropTypes.func
}

export default Button
