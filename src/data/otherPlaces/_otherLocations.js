import karhus from './karhus'
import outsideCampus from './outsideCampus'

export const roomsOther = [...karhus, ...outsideCampus]

export const locationsOther = {
  'Utanför campus': {
    id: '5185c29c-e9ca-41d0-92ad-ad851f3c4784',
    value: '5185c29c-e9ca-41d0-92ad-ad851f3c4784',
    text: 'Utanför campus',
    label: 'Utanför campus',
    rooms: roomsOther
  },
  Kårhus: {
    id: 'de6ebd1a-eb0b-4de4-b549-bc57bb9fadf5',
    value: 'de6ebd1a-eb0b-4de4-b549-bc57bb9fadf5',
    text: 'Kårhus',
    label: 'Kårhus',
    rooms: karhus
  }
}
