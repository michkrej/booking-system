import karhus from "./karhus";
import outsideCampus from "./outsideCampus";
import TF from "./TF";

export const roomsOther = [...karhus, ...outsideCampus, ...TF];

export const locationsOther = {
  "Övrigt utanför campus": {
    id: "5185c29c-e9ca-41d0-92ad-ad851f3c4784",
    name: "Utanför campus",
    rooms: outsideCampus,
  },
  Kårhus: {
    id: "de6ebd1a-eb0b-4de4-b549-bc57bb9fadf5",
    name: "Kårhus",
    rooms: karhus,
  },
  Trädgårsföreningen: {
    id: "97514b8e-f9b6-486a-9a73-f09398d61429",
    name: "Trädgårdsföreningen",
    rooms: TF,
  },
};
