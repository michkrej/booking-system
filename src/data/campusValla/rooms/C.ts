import { type Room } from "../../../utils/interfaces";

const locationId = "550ddbe9-6fa1-49de-9336-01744c67b233";

export const corridorsC = {
  U: {
    name: "U-korridoren",
    id: "9aed8b11-542e-4583-91c7-17d8d5ea57a7",
    locationId,
  },
  T: {
    name: "T-korridoren",
    id: "b1e4cd20-2857-416a-9c32-7a35544ff8ea",
    locationId,
  },
  S: {
    name: "S-korridoren",
    id: "2c57a3c8-3ad0-40bc-941c-44f79d7f84d1",
    locationId,
  },
  P: {
    name: "P-korridoren",
    id: "a029293e-f391-4922-a31a-dd1f9b564925",
    locationId,
  },
  R: {
    name: "R-korridoren",
    id: "74897fa9-0158-4e46-8501-6e7a36b50753",
    locationId,
  },
} as const;

const roomsC = [
  ...Object.values(corridorsC),
  {
    name: "U1",
    id: "c9394b56-0e30-4b95-a821-ac33d7e632fc",
    corridorId: corridorsC.U.id,
  },
  {
    name: "U2",
    id: "3ddd9c1a-e684-4a73-8bc0-01da4ffeee92",

    corridorId: corridorsC.U.id,
  },
  {
    name: "U3",
    id: "d2e62e84-9688-49c4-95af-e2aae8913601",

    corridorId: corridorsC.U.id,
  },
  {
    name: "U4",
    id: "1ba1f71d-2eab-4ca3-a68d-5ddc6a1462d4",

    corridorId: corridorsC.U.id,
  },
  {
    name: "U6",
    id: "bc58d88b-2b23-4f2e-886a-240b9cb8c8f6",
    corridorId: corridorsC.U.id,
  },
  {
    name: "U7",
    id: "2823ef49-bc8b-4c96-bdac-10120326461c",

    corridorId: corridorsC.U.id,
  },
  {
    name: "U10",
    id: "7bedd705-3453-4e18-a479-e16506e99577",

    corridorId: corridorsC.U.id,
  },
  {
    name: "U11",
    id: "a04f5f8e-533b-4e32-87fb-47460c5808af",

    corridorId: corridorsC.U.id,
  },
  {
    name: "U14",
    id: "33150af1-2add-4334-b91e-9909de5547ad",

    corridorId: corridorsC.U.id,
  },
  {
    name: "U15",
    id: "e64d9976-f1bb-4998-b257-e79640b2de80",

    corridorId: corridorsC.U.id,
  },
  /* T-korridoren */
  {
    name: "T1",
    id: "9e0ea521-353d-45b1-8240-9db22c45ab6a",

    corridorId: corridorsC.T.id,
  },
  {
    name: "T2",
    id: "b61d88b0-3252-4539-814a-1a6665c755db",

    corridorId: corridorsC.T.id,
  },
  {
    name: "T11",
    id: "f01cefaa-bb80-4ecf-8183-604784f08714",

    corridorId: corridorsC.T.id,
  },
  {
    name: "T15",
    id: "91d25fc3-5b35-48ab-9e2c-1d8e0eb2b5d7",

    corridorId: corridorsC.T.id,
  },
  {
    name: "T19",
    id: "53a39596-28ff-48d3-aa97-2a87abfd3fe4",

    corridorId: corridorsC.T.id,
  },
  {
    name: "T23",
    id: "d799a5be-6e4b-4bdf-88e8-b351816aaf4f",

    corridorId: corridorsC.T.id,
  },
  {
    name: "T27",
    id: "0dbb474f-fbd2-43f7-b560-50903a918623",

    corridorId: corridorsC.T.id,
  },
  /* S-korridoren */
  {
    name: "S2",
    id: "4ff5191a-88d5-4724-bfd7-13f502fc7f71",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S3",
    id: "c692f0a8-0036-4dd1-8f89-c640ba327c93",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S6",
    id: "e5fa1d15-aaea-4cce-816b-a4559a4f18da",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S7",
    id: "e2d387ce-18e0-4cd3-ad61-6c0f5daf6ba4",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S10",
    id: "c20a559d-7ffc-4f34-acc2-837f9d567301",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S11",
    id: "9cac73bb-0ce2-4038-965d-01cde36c2bdd",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S14",
    id: "56bf1526-07d6-4717-a0d5-f320a054e202",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S15",
    id: "9e38a134-f9d0-4c8e-b4e1-233195020d89",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S18",
    id: "c3d5f22e-e53a-4aa7-aaa7-ba8f4cca0271",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S19",
    id: "c277ae20-1dcd-4788-a151-b82ecce886f2",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S22",
    id: "781f5d64-f321-4ec4-95a3-089801823b4c",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S23",
    id: "8a083d1e-98b2-4ea9-bf4a-24b4d087ff71",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S25",
    id: "a751332b-427f-4232-ae19-e9f36f5f936b",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S26",
    id: "21338b84-0ddd-4fbd-850e-983053269972",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S27",
    id: "b8870cdd-870d-4914-8646-4b3633bb185a",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S35",
    id: "74d6e87f-01ea-4f53-aa69-320f89f6085d",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S37",
    id: "f85dd2c6-1c74-43cd-b5ec-a102617945fa",

    corridorId: corridorsC.S.id,
  },
  {
    name: "S41",
    id: "97943225-0624-4c1f-aaba-779e45f9d2db",

    corridorId: corridorsC.S.id,
  },
  {
    name: "SG1",
    id: "fed24a99-8229-4e93-bed3-958eda4a7a4f",

    corridorId: corridorsC.S.id,
  },
  /* R-korridoren */
  {
    name: "R2",
    id: "dda18f3b-7fe3-4974-8854-08ac9de06df8",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R6",
    id: "243a0c3d-ad39-451d-ac63-8e6e51cb4a84",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R18",
    id: "d4bdf8a0-cb39-4992-8cd0-6a2313d13fae",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R19",
    id: "c862a01a-58cd-4770-b780-b3ab42086af0",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R22",
    id: "7c76e08f-f742-4375-b6e5-c7af16646ce0",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R23",
    id: "49ad1c6b-c47a-4f42-82b6-0a0ba8f4a571",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R26",
    id: "adfbd30a-6fe1-4cea-9da4-5be0486a9c95",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R27",
    id: "7b0090c4-6e3a-4831-83be-4f67d22fef98",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R34",
    id: "44400255-4777-4520-b90d-1cd952636d46",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R35",
    id: "9b6a29ef-afd9-410c-b177-319356c39084",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R36",
    id: "15a0adcc-648c-4e84-8478-42dcc1803dd4",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R37",
    id: "11c1792e-30b0-4b7a-9fc7-6ecac0b1c86a",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R41",
    id: "7d7a574b-6a87-41d2-b66a-66a6be58d131",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R42",
    id: "2e56a6e8-5530-4dc3-a425-486ac98c1e45",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R43",
    id: "a5f471e2-cceb-4ef8-ab71-160604c62729",

    corridorId: corridorsC.R.id,
  },
  {
    name: "R44",
    id: "7ca59a02-b5b3-4535-9c72-47305e8f823c",

    corridorId: corridorsC.R.id,
  },
  {
    name: "RG1",
    id: "c779e03d-16d8-47d2-b96d-3416ca1821c7",

    corridorId: corridorsC.R.id,
  },
  {
    name: "RG2",
    id: "5625d892-cf53-4a32-a2ae-77cfe725835a",

    corridorId: corridorsC.R.id,
  },
  {
    name: "RG3",
    id: "056222e1-da15-40f2-9a9e-43d5ab6730c0",

    corridorId: corridorsC.R.id,
  },
  /* P-korridoren */
  {
    name: "P18",
    id: "69063d3d-d610-470a-be96-1d51a8e388db",

    corridorId: corridorsC.P.id,
  },
  {
    name: "P22",
    id: "2056c026-2775-4a7d-8207-f2e42e517eef",

    corridorId: corridorsC.P.id,
  },
  {
    name: "P26",
    id: "8079d7b3-ff42-4cb9-b621-cdd3ebbd3fff",

    corridorId: corridorsC.P.id,
  },
  {
    name: "P30",
    id: "d959346b-a33d-4433-a6d4-b4b0a3cde3d3",

    corridorId: corridorsC.P.id,
  },
  {
    name: "P34",
    id: "233d6abf-e9ee-4c55-a859-93afe5f1bf27",

    corridorId: corridorsC.P.id,
  },
  {
    name: "P36",
    id: "50602537-dca2-402f-b634-176e666030d1",

    corridorId: corridorsC.P.id,
  },
  {
    name: "P42",
    id: "60a6c054-53a6-459c-8268-cf74589c8124",

    corridorId: corridorsC.P.id,
  },
  {
    name: "P44",
    id: "905dc9a6-454f-4037-896c-325e11aae40f",

    corridorId: corridorsC.P.id,
  },
  {
    name: "PG1",
    id: "31dc1ed5-4b66-4212-9350-b63f073d2bb0",

    corridorId: corridorsC.P.id,
  },
  {
    name: "PG2",
    id: "e66f3800-4f10-49d8-b76c-eaf785f55c21",

    corridorId: corridorsC.P.id,
  },
  /* Föreläsningsalar + collo */
  {
    name: "C1",
    id: "739920e4-c605-4bdf-b5c4-f996a62a2b19",
  },
  {
    name: "C2",
    id: "6f2d17dd-3ff4-4b05-bd13-17328a30f3ae",
  },
  {
    name: "C3",
    id: "d732baeb-4ddb-4993-ab7f-6a96182e0379",
  },
  {
    name: "C4",
    id: "b6cfe220-0f02-4aca-8f4f-345cb398aea8",
  },
  {
    name: "Colosseum",
    id: "64f74234-8e86-4d99-827c-deb4774c809a",
  },
  {
    name: "Utanför C4",
    id: "72fdf53e-5b7e-48fb-87a3-e80ea422602b",
  },
] as Room[];

export default roomsC;
