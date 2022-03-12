import { locationsUS, roomsUS } from './campusUS'
import { locationsValla, roomsValla } from './campusValla'
import { sortAlphabetically } from './helpers'

const otherLocations = {
  'Utanför campus': {
    id: '5185c29c-e9ca-41d0-92ad-ad851f3c4784',
    value: '5185c29c-e9ca-41d0-92ad-ad851f3c4784',
    text: 'Utanför campus',
    label: 'Utanför campus'
  }
}

const otherRooms = [
  {
    text: 'Övrigt',
    id: 'ead531c3-372c-4dd6-9280-2c9db28ddc38',
    locationId: otherLocations['Utanför campus'].id
  }
]

export const locations = { ...locationsValla, ...locationsUS, ...otherLocations }

export const rooms = [...roomsValla, ...roomsUS, ...otherRooms]

export const campuses = [
  {
    label: 'Valla',
    value: 0
  },
  {
    label: 'US',
    value: 1
  }
]

export const filterCampusLocations = (campus) => {
  switch (campus) {
    case 'Valla':
      return { ...locationsValla, ...otherLocations }
    case 'US':
      return { ...locationsUS, ...otherLocations }
  }
}

export const filterCampusRooms = (campus) => {
  switch (campus) {
    case 'Valla':
      return [...roomsValla, ...otherRooms]
    case 'US':
      return [...roomsUS, ...otherRooms]
  }
}
