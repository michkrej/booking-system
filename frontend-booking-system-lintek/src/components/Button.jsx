import React from 'react'
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
    children: PropTypes.element.isRequired,
    handleClick: PropTypes.func,
}

export default Button
