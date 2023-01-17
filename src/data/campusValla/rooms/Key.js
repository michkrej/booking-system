import { locations } from '../../locationsData'

export default [
  {
    text: 'Key 1',
    id: '0a5c19d6-552b-4032-95db-852bd5614538'
  },
  {
    text: 'KY35',
    id: '55f3c641-a1e1-4721-ab2f-79c3f5c04a17'
  },
  {
    text: 'KY34',
    id: '0211a685-a7a6-42ff-a128-6b7baa607cca'
  },
  {
    text: 'KY21',
    id: '2fd38910-e8c4-4396-bc71-e246ae1f9654'
  },
  {
    text: 'KY23',
    id: '0d53e901-96bc-4238-8183-e4542b8c937d'
  },
  {
    text: 'KY24',
    id: '67a22ef8-18ee-47c9-98b2-cab14bb2148c'
  },
  {
    text: 'KY25',
    id: '075a28bb-e9df-4d58-9138-5d2e543ef23c'
  },
  {
    text: 'KY26',
    id: 'eb98ae3c-d362-4eb7-a1d0-9cef45e2eca7'
  },
  {
    text: 'KY31',
    id: '99f093a9-8739-49c8-9048-1b318f253c90'
  },
  {
    text: 'KY32',
    id: 'b74201ff-65c2-41be-9187-92e49a9ea9f6'
  },
  {
    text: 'KY33',
    id: 'c1218d82-8bc0-49c3-80b2-af28903fa508'
  },
  {
    text: 'KG21',
    id: '5c0441fe-6bb2-4050-848f-b5bddf5d3bc5'
  },
  {
    text: 'KG22',
    id: '0e435ad2-298a-4e0c-ba68-0c8d50d182d4'
  },
  {
    text: 'KG23',
    id: '46b7f655-dd3f-42f6-a125-04e340ebc649'
  },
  {
    text: 'KG31',
    id: 'efcc209d-6e61-42be-b1f4-b95ce36a556a'
  },
  {
    text: 'KG32',
    id: '3174abff-1f4d-44d9-bee5-493beb0e517f'
  },
  {
    text: 'KG33',
    id: '550592a8-69db-4a14-ac44-612f4da6bb40'
  },
  {
    text: 'KG36',
    id: 'ad18e633-bba0-4d17-8e15-4d5a8e03bc9c'
  },
  {
    text: 'KG37',
    id: 'ada5ef9b-2991-495b-ac5a-3d613a1c8544'
  },
  {
    text: 'KG43',
    id: '9049baee-a968-49fd-979f-c7478a57487c'
  },
  {
    text: 'KG44',
    id: '58b544e4-3d6c-4fa7-a6ca-bf6f5ddbca9c'
  },
  {
    text: 'KG41',
    id: '3d738782-d1f6-4caa-955c-96f0099fc7ed'
  },
  {
    text: 'KG42',
    id: '0a4a43b1-8a17-4167-a7d2-cd3f314ba67a'
  },
  {
    text: 'KG45',
    id: '466d4dee-fb57-4a6c-a7cc-b46072eb777b'
  },
  {
    text: 'KG46',
    id: '1140c74d-97e3-4741-8c84-5bfaf507c5b9'
  },
  {
    text: 'KG47',
    id: '2f104da6-d16b-4f57-ade1-455fd16870ef'
  },
  {
    text: 'KG48',
    id: 'dd259c44-4277-4094-870e-fb8d594fb781'
  }
].map(({ text, id }) => ({
  text,
  id,
  locationId: locations.campusValla['Key-huset'].id
}))
