import { locations } from '../locationsData'

export default [
  {
    text: 'Eken, HS',
    id: '1df1bbea-a0b3-4fe8-9897-a0a2579d0e33'
  },
  {
    text: 'Linden, HS',
    id: '047e146f-400e-410f-bacd-cdddd51752e4'
  },
  {
    text: 'Björken',
    id: 'e2d1da6e-c090-4d6e-a818-e4bdf34a217f'
  },
  {
    text: 'Almen',
    id: 'a11b8b9c-5936-4221-b0a7-77706e6446aa'
  }
].map(({ text, id }) => ({
  text,
  id,
  locationId: locations.campusUS.house421.id
}))
