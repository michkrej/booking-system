const colors = {
  'C-huset': '#8ecd3c',
  Utomhus: '#8E44AD',
  'A-huset': '#2ecc71',
  Studenthuset: '#f39c12',
  'B-huset': '#ffd15c',
  Hemklassrum: '#e9e7fc',
  'Key-huset': '#00a86b',
  Kårallen: '#26619c',
  Annat: '#74867c'
}

export const committees = [
  {
    text: 'STABEN',
    id: 1,
    color: '#9B1111'
  },
  {
    text: 'URF',
    id: 2,
    color: '#97EA1F'
  },
  {
    text: 'YF',
    id: 3,
    color: '#000000'
  },
  {
    text: 'MPiRE',
    id: 4,
    color: '#990A0A'
  },
  {
    text: 'TackLING',
    id: 5,
    color: '#9D25CA'
  },
  {
    text: 'CM',
    id: 6,
    color: '#0A741A'
  },
  {
    text: 'GF',
    id: 7,
    color: '#A10E41'
  }
]

export const locations = [
  {
    text: 'C-huset',
    id: 1,
    color: colors['C-huset'],
    value: 1,
    label: 'C-huset'
  },
  {
    text: 'Utomhus',
    id: 2,
    color: colors.Utomhus,
    value: 2,
    label: 'Utomhus'
  },
  {
    text: 'A-huset',
    id: 3,
    color: colors['A-huset'],
    value: 3,
    label: 'A-huset'
  },
  {
    text: 'Key-huset',
    id: 4,
    color: colors['Key-huset'],
    value: 4,
    label: 'Key-huset'
  }
]

export const rooms = [
  {
    text: 'U1',
    id: 1,
    locationId: 1
  },
  {
    text: 'U3',
    id: 2,
    locationId: 1
  },
  {
    text: 'R44',
    id: 3,
    locationId: 3
  },
  {
    text: 'R14',
    id: 4,
    locationId: 4
  },
  {
    text: 'S-korridoren',
    id: 5,
    locationId: 1
  },
  {
    text: 'A1',
    id: 6,
    locationId: 2
  },
  {
    text: 'A2',
    id: 7,
    locationId: 2
  }
]
