import house001 from "./house001";
import house240 from "./house240";
import house420 from "./house420";
import house421 from "./house421";
import house448 from "./house448";
import house462 from "./house462";
import house463 from "./house463";
import house473 from "./house473";
import house511 from "./house511";

const roomsOther = [
  {
    name: "Märkesbacken",
    id: "5e474e7b-898b-4628-9d4e-8e1edf7b27e0",
  },
];

export const locationsUS = {
  "Hus 001": {
    id: "949636dc-997a-4aa2-8582-7c81a12dad4d",
    name: "Hus 001",
    rooms: house001,
  },
  "Hus 240": {
    id: "c1173d8c-3b1e-4e91-bf5a-38fa30f23bb7",
    name: "Hus 240",
    rooms: house240,
  },
  "Hus 420": {
    id: "52392466-b327-49cd-83e7-fbc1edd13f56",
    name: "Hus 420",
    rooms: house420,
  },
  "Hus 421": {
    id: "8d31f888-99c9-4caf-a3ba-c31619a658f6",
    name: "Hus 421",
    rooms: house421,
  },
  "Hus 448": {
    id: "be6df087-6884-4f80-87a1-8d0547ab2feb",
    name: "Hus 448",
    rooms: house448,
  },
  "Hus 462": {
    id: "f536fe7a-2bbb-4321-8edb-92346f3f5ffc",
    name: "Hus 462",
    rooms: house462,
  },
  "Hus 463": {
    id: "0d8d31ba-f773-4db2-9119-0fdcbf342819",
    name: "Hus 463",
    rooms: house463,
  },
  "Hus 473": {
    id: "a8e79460-581b-423a-a0f5-07d1ae75b940",
    name: "Hus 473",
    rooms: house473,
  },
  "Hus 511": {
    id: "faceed67-e485-4ed8-8aeb-264d72e3be52",
    name: "Hus 511",
    rooms: house511,
  },
  "Övriga områden på campus US": {
    id: "56138ae6-f3f4-40cc-88ec-bd1d841e3770",
    name: "Övriga områden på campus",
    rooms: roomsOther,
  },
};

export const roomsUS = [
  ...house001,
  ...house240,
  ...house420,
  ...house421,
  ...house448,
  ...house462,
  ...house463,
  ...house473,
  ...house511,
  ...roomsOther,
];
