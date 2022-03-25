import { locationsUS, roomsUS } from './campusUS'
import { locationsValla, roomsValla } from './campusValla'

const otherLocations = {
  'Utanför campus': {
    id: '5185c29c-e9ca-41d0-92ad-ad851f3c4784',
    value: '5185c29c-e9ca-41d0-92ad-ad851f3c4784',
    text: 'Utanför campus',
    label: 'Utanför campus'
  },
  Kårhus: {
    id: 'de6ebd1a-eb0b-4de4-b549-bc57bb9fadf5',
    value: 'de6ebd1a-eb0b-4de4-b549-bc57bb9fadf5',
    text: 'Kårhus',
    label: 'Kårhus'
  }
}

const karhus = [
  {
    text: 'HG',
    id: '07f88233-1f48-4781-8d89-2669a80e393d',
    locationId: otherLocations['Kårhus'].id
  },
  {
    text: 'KK - stora salen',
    id: 'c510648d-37a0-4019-87e1-fbbf1b1adf3a',
    locationId: otherLocations['Kårhus'].id
  },
  {
    text: 'KK - lilla salen',
    id: 'd1d12a5b-8bcb-47b2-9450-e0d490aa6a96',
    locationId: otherLocations['Kårhus'].id
  },
  {
    text: 'KK',
    id: 'a232bbef-b3c3-4e0b-9736-3775139578d9',
    locationId: otherLocations['Kårhus'].id
  },
  {
    text: 'Kårallen - matsalen',
    id: 'fa5bc487-5753-48da-beb7-bf6b31b9f94a',
    locationId: otherLocations['Kårhus'].id
  },
  {
    text: 'Kårallen - gasquen',
    id: 'a2f3bf6e-f7a1-4e7a-8c8f-9119a147f558',
    locationId: otherLocations['Kårhus'].id
  },
  {
    text: 'Kårallen - baljan',
    id: '50923589-f79b-4770-ac8b-35fee2a497f2',
    locationId: otherLocations['Kårhus'].id
  },
  {
    text: 'Kårallen',
    id: 'ed559a94-faaf-4daf-b70f-c7439fb989d7',
    locationId: otherLocations['Kårhus'].id
  },
  {
    text: 'Amfi',
    id: 'bc15ae77-59f4-4531-9790-6040f264bb87',
    locationId: otherLocations['Kårhus'].id
  },
  {
    text: 'Blå havet',
    id: '5c7326f1-b3a9-4e62-9a25-923a97cb181f',
    locationId: otherLocations['Kårhus'].id
  },
  {
    text: 'Örat',
    id: 'bded005f-8e83-4fdf-8b1b-0d2084391af6',
    locationId: otherLocations['Kårhus'].id
  }
]

const otherRooms = [
  {
    text: 'Övrigt',
    id: 'ead531c3-372c-4dd6-9280-2c9db28ddc38',
    locationId: otherLocations['Utanför campus'].id
  },
  {
    text: 'SkåLand',
    id: '352c3dde-3767-4940-aa63-a4eac42449bf',
    locationId: otherLocations['Utanför campus'].id
  },
  ...karhus
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
