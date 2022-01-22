import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const SelectLocation = ({ handleChange, locations }) => {
    return (
        <Select
            options={locations}
            onChange={handleChange}
            placeholder="Filtrera på plats"
            isClearable={true}
        />
    )
}

SelectLocation.propTypes = {
    handleChange: PropTypes.func,
    locations: PropTypes.array,
}

export default SelectLocation
