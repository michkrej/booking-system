import BookableLocations from "./rooms/BookableLocations";
import A from "./rooms/A";
import B from "./rooms/B";
import C, { corridorsC } from "./rooms/C";
import Fysik from "./rooms/Fysik";
import I from "./rooms/I";
import Key from "./rooms/Key";
import Other from "./rooms/Other";
import Studenthuset from "./rooms/Studenthuset";
import TEMA from "./rooms/TEMA";

export const locationsValla = {
  "C-huset": {
    id: "550ddbe9-6fa1-49de-9336-01744c67b233",
    name: "C-huset",
    rooms: C,
    corridors: corridorsC,
  },
  "Områden på campus": {
    id: "a52889bd-908a-4a60-b432-13b863ff3d0b",
    name: "Områden på campus",
    rooms: BookableLocations,
  },
  "A-huset": {
    id: "b1a8936a-94a8-4dba-8840-70fcbfda97a8",
    name: "A-huset",
    rooms: A,
  },
  "Key-huset": {
    id: "871176f0-52b4-459b-930d-85097727b536",
    name: "Key-huset",
    rooms: Key,
  },
  "Fysik-huset": {
    id: "1bb05d89-75d9-4063-8d81-b79d7ee69e1f",
    name: "Fysik-huset",
    rooms: Fysik,
  },
  "I-huset": {
    id: "a992802d-e580-4b15-b0ca-070097c809fc",
    name: "I-huset",
    rooms: I,
  },
  Studenthuset: {
    id: "8e5c3fd8-77b5-470b-b020-e7be3be72676",
    name: "Studenthuset",
    rooms: Studenthuset,
  },
  "B-huset": {
    id: "5586e0a9-91ea-4539-b6f8-19edc139e805",
    name: "B-huset",
    rooms: B,
  },
  "TEMA-huset": {
    id: "0b86fb4c-94b6-47f3-9cec-a51883594e5a",
    name: "TEMA-huset",
    rooms: TEMA,
  },
  "Övriga områden på campus": {
    id: "3b651c71-3202-47e8-8b94-d5ba7175b1d0",
    name: "Övriga områden på campus",
    rooms: Other,
  },
} as const;

export const roomsValla = [
  ...A,
  ...B,
  ...C,
  ...Fysik,
  ...I,
  ...Key,
  ...Studenthuset,
  ...BookableLocations,
  ...Other,
];
