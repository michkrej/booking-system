import PropTypes from 'prop-types'
import { color } from '../CONSTANTS'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface SelectInputProps {
  handleChange: (option: any) => void
  options: { value: string | number; label: string }[]
  current: any
  placeholder: string
  multiple?: boolean
  clearable?: boolean
}

export const SelectInput = ({
  handleChange,
  options,
  current,
  placeholder,
  multiple = false,
  clearable = true
}: SelectInputProps) => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem value={option.value.toString()}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
