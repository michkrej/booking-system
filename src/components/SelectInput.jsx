import PropTypes from 'prop-types'
import Select from 'react-select'
import { primary } from '../App'

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
          primary: primary,
          primary75: '#670c47b5',
          primary50: '#670c4778',
          primary25: '#670c473b'
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
