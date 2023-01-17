import { locations } from '../../locationsData'

export default [
  {
    text: 'Zenit',
    id: '0b92c10a-d6e7-4da0-bd99-44cfc375408c'
  },
  {
    text: 'MatNat-backen',
    id: 'dd329c78-c810-4611-bb27-88042b6c6e5b'
  },
  {
    text: 'Bokab',
    id: '85982009-31dd-4597-9362-cd1b093b7f17'
  },
  {
    text: 'Baljan',
    id: 'e9c2c27c-e9c0-473f-ba54-c73dd468e729'
  },
  {
    text: 'LiU-store',
    id: '13b0a454-4128-4e6a-9d52-f8ce0b3f24fa'
  },
  {
    text: 'LiU-secondhand',
    id: '38389bd8-62e3-4ec1-9860-70b7a10b543c'
  },
  {
    text: 'M-verkstan',
    id: 'ac63bbe8-4ea7-4847-9a57-66da7e966fc1'
  },
  {
    text: 'Campusbokhandeln',
    id: 'b9968620-2b3d-44a5-ae59-3858b7c62634'
  },
  {
    text: 'Biblioteket',
    id: 'e17bf523-259a-4752-9a96-f4dd6d0c7db6'
  },
  {
    text: 'Campushallen',
    id: 'd5950789-a6f9-4cd6-9cbf-6ec88c94bc52'
  }
].map(({ text, id }) => ({
  text,
  id,
  locationId: locations.campusValla['Övriga områden på campus'].id
}))
