import BookableLocations from './rooms/BookableLocations'
import { A } from './rooms/C'
import { B } from './rooms/C'
import { C, corridorsC } from './rooms/C'
import Fysik from './rooms/Fysik'
import I from './rooms/I'
import Key from './rooms/Key'
import Other from './rooms/Other'
import Studenthuset from './rooms/Studenthuset'

export const locationsValla = {
  'C-huset': {
    id: '550ddbe9-6fa1-49de-9336-01744c67b233',
    value: '550ddbe9-6fa1-49de-9336-01744c67b233',
    text: 'C-huset',
    label: 'C-huset',
    rooms: C,
    corridors: corridorsC
  },
  'Områden på campus': {
    id: 'a52889bd-908a-4a60-b432-13b863ff3d0b',
    value: 'a52889bd-908a-4a60-b432-13b863ff3d0b',
    text: 'Områden på campus',
    label: 'Områden på campus',
    rooms: BookableLocations
  },
  'A-huset': {
    id: 'b1a8936a-94a8-4dba-8840-70fcbfda97a8',
    value: 'b1a8936a-94a8-4dba-8840-70fcbfda97a8',
    text: 'A-huset',
    label: 'A-huset',
    rooms: A
  },
  'Key-huset': {
    id: '871176f0-52b4-459b-930d-85097727b536',
    value: '871176f0-52b4-459b-930d-85097727b536',
    text: 'Key-huset',
    label: 'Key-huset',
    rooms: Key
  },
  'Fysik-huset': {
    id: '1bb05d89-75d9-4063-8d81-b79d7ee69e1f',
    value: '1bb05d89-75d9-4063-8d81-b79d7ee69e1f',
    text: 'Fysik-huset',
    label: 'Fysik-huset',
    rooms: Fysik
  },
  'I-huset': {
    id: 'a992802d-e580-4b15-b0ca-070097c809fc',
    value: 'a992802d-e580-4b15-b0ca-070097c809fc',
    text: 'I-huset',
    label: 'I-huset',
    rooms: I
  },
  Studenthuset: {
    id: '8e5c3fd8-77b5-470b-b020-e7be3be72676',
    value: '8e5c3fd8-77b5-470b-b020-e7be3be72676',
    text: 'Studenthuset',
    label: 'Studenthuset',
    rooms: Studenthuset
  },
  'B-huset': {
    id: '5586e0a9-91ea-4539-b6f8-19edc139e805',
    value: '5586e0a9-91ea-4539-b6f8-19edc139e805',
    text: 'B-huset',
    label: 'B-huset',
    rooms: B
  },
  'Övriga områden på campus': {
    id: '3b651c71-3202-47e8-8b94-d5ba7175b1d0',
    value: '3b651c71-3202-47e8-8b94-d5ba7175b1d0',
    text: 'Övriga områden på campus',
    label: 'Övriga områden på campus',
    rooms: Other
  }
}

export const roomsValla = [
  ...A,
  ...B,
  ...C,
  ...Fysik,
  ...I,
  ...Key,
  ...Studenthuset,
  ...BookableLocations,
  ...Other
]
