import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const SelectInput = ({ handleChange, options, current, placeholder }) => {
    return (
        <Select
            options={options}
            onChange={handleChange}
            placeholder={placeholder}
            isClearable={true}
            value={current}
        />
    )
}

SelectInput.propTypes = {
    handleChange: PropTypes.func,
    options: PropTypes.array,
    current: PropTypes.object,
    placeholder: PropTypes.string,
}

export default SelectInput
