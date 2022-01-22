import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const SelectLocation = ({ handleChange, locations, current }) => {
    return (
        <Select
            options={locations}
            onChange={handleChange}
            placeholder="Filtrera på plats"
            isClearable={true}
            value={current}
        />
    )
}

SelectLocation.propTypes = {
    handleChange: PropTypes.func,
    locations: PropTypes.array,
    current: PropTypes.object,
}

export default SelectLocation
