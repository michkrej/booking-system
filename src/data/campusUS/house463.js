import { locations } from '../locationsData'

export default [
  {
    text: 'Berzelius, HS',
    id: '65828199-c651-4599-8f20-876d6066ecf6'
  },
  {
    text: 'Rönnen',
    id: '0fb3ddd6-814e-4f35-87ec-8c36a99484cf'
  },
  {
    text: 'Kotten',
    id: 'e6cad65f-703d-4cd5-a134-cd8983f5ad42'
  },
  {
    text: 'Fröet',
    id: '4dec7a69-2d50-480f-894e-8c75a8b7080e'
  },
  {
    text: 'Barret',
    id: 'dc02689a-c722-41ce-a794-6f8632899610'
  },
  {
    text: 'Ingrid Marie',
    id: '5b6d121a-7658-4259-be90-c7fdbaa5e646'
  },
  {
    text: 'Cox Pomona',
    id: '51d60e75-5aa4-4de1-9c39-78a265558c33'
  },
  {
    text: 'Aroma',
    id: 'ab27e405-cf73-4e7d-a117-dd320da76aa3'
  },
  {
    text: 'Astrakan',
    id: 'f120e772-d604-41d9-89a0-c11cbc13ba72'
  },
  {
    text: 'Åkerö',
    id: 'a7dff6de-31f0-466e-9281-a768761db851'
  }
].map(({ text, id }) => ({
  text,
  id,
  locationId: locations.campusUS.house463.id
}))
