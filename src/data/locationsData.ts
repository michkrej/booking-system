import { locationsUS, roomsUS } from './campusUS/campusUS'
import { locationsValla, roomsValla } from './campusValla/campusValla'
import { locationsOther, roomsOther } from './otherPlaces/_otherLocations'

export const locations = {
  campusValla: locationsValla,
  campusUS: locationsUS,
  others: locationsOther
} as const

export const locationsNonGrouped = Object.values({
  ...locationsValla,
  ...locationsUS,
  ...locationsOther
})

export const rooms = [...roomsValla, ...roomsUS, ...roomsOther] as const

const VALLA_CAMPUS = {
  label: 'Valla',
  value: 0
} as const

const US_CAMPUS = {
  label: 'US',
  value: 1
} as const

export const campuses = {
  [VALLA_CAMPUS.label]: VALLA_CAMPUS,
  [US_CAMPUS.label]: US_CAMPUS
}

type CampusName = typeof VALLA_CAMPUS.label | typeof US_CAMPUS.label

const campusLocationsMap = {
  [VALLA_CAMPUS.label]: { ...locations.campusValla, ...locations.others },
  [US_CAMPUS.label]: { ...locations.campusUS, ...locations.others }
}

export const filterCampusLocations = (campus: CampusName) => {
  return campusLocationsMap[campus] || {}
}

const campusRoomsMap = {
  [VALLA_CAMPUS.label]: [...roomsValla, ...roomsOther],
  [US_CAMPUS.label]: [...roomsUS, ...roomsOther]
}

export const filterCampusRooms = (campus: CampusName) => {
  return campusRoomsMap[campus] || []
}
