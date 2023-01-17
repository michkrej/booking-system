import { locationsUS, roomsUS } from './campusUS/campusUS'
import { locationsValla, roomsValla } from './campusValla/campusValla'
import { locationsOther, roomsOther } from './otherPlaces/_otherLocations'

export const locations = {
  campusValla: locationsValla,
  campusUS: locationsUS,
  others: locationsOther
}

export const rooms = [...roomsValla, ...roomsUS, ...roomsOther]

const VALLA_CAMPUS = {
  label: 'Valla',
  value: 0
}

const US_CAMPUS = {
  label: 'US',
  value: 1
}
export const campuses = [VALLA_CAMPUS, US_CAMPUS]

const campusLocationsMap = {
  [VALLA_CAMPUS.value]: { ...locations.campusValla, ...locations.others },
  [US_CAMPUS.value]: { ...locations.campusUS, ...locations.others }
}

export const filterCampusLocations = (campus) => {
  return campusLocationsMap[campus] || {}
}

const campusRoomsMap = {
  [VALLA_CAMPUS.value]: [...roomsValla, ...roomsOther],
  [US_CAMPUS.value]: [...roomsUS, ...roomsOther]
}

export const filterCampusRooms = (campus) => {
  return campusRoomsMap[campus] || []
}
