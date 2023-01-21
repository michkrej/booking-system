/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import SelectInput from './SelectInput'
import { locationsValla } from '../data/campusValla/campusValla'

const Item = styled('div')(() => ({
  marginBottom: '1em',
  width: '100%'
}))

const locationVallaId = locationsValla['C-huset'].id

const FilterTimelineLocations = ({
  campuses,
  handleCampusChange,
  campus,
  locations,
  handleLocationChange,
  currentLocation,
  handleRoomChange,
  currentRoom
}) => {
  return (
    <Stack>
      <Item>
        <SelectInput
          options={campuses}
          handleChange={handleCampusChange}
          current={campus}
          placeholder="Campus"
          clearable={false}
        />
      </Item>
      <Item>
        <SelectInput
          options={locations}
          handleChange={handleLocationChange}
          current={currentLocation}
          placeholder="Filtrera på plats"
        />
      </Item>
      {currentLocation && currentLocation.id === locationVallaId && (
        <Item>
          <SelectInput
            options={currentLocation.rooms
              .filter((room) => room.text.includes('korridoren'))
              .map(({ id, text }) => ({ value: id, label: text }))}
            handleChange={handleRoomChange}
            current={currentRoom}
            placeholder="Filtrera på korridor"
          />
        </Item>
      )}
    </Stack>
  )
}

export default FilterTimelineLocations
