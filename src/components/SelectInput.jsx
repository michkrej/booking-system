import PropTypes from 'prop-types'
import Select from 'react-select'
import { color } from '../CONSTANTS'

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
          primary: color.primary,
          primary75: color.primary75,
          primary50: color.primary50,
          primary25: color.primary25
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
