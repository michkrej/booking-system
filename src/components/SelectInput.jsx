import PropTypes from 'prop-types'
import Select from 'react-select'

const SelectInput = ({
  handleChange,
  options,
  current,
  placeholder,
  multiple = false,
  clearable = true
}) => {
  return (
    <Select
      options={options}
      getOptionLabel={(option) => option.text ?? option.label}
      getOptionValue={(option) => option.id ?? option.value}
      onChange={handleChange}
      placeholder={placeholder}
      isClearable={clearable}
      value={current}
      isMulti={multiple}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#E1007A',
          primary75: '#e84aa0',
          primary50: '#ebb2d1',
          primary25: '#fcebf4'
        }
      })}
    />
  )
}

SelectInput.propTypes = {
  handleChange: PropTypes.func,
  options: PropTypes.array,
  current: PropTypes.object,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  clearable: PropTypes.bool
}

export default SelectInput
