export const committees = [
  {
    text: 'STABEN',
    id: '97584aca-276a-4fb8-98f4-82947f3c5e35',
    color: '#9B1111'
  },
  {
    text: 'URF',
    id: '850e6ab4-e900-4f34-a593-0361bb0451a6',
    color: '#97EA1F'
  },
  {
    text: 'YF',
    id: 'be4ba79b-ed9a-43dd-8270-780c87eaac5d',
    color: '#000000'
  },
  {
    text: 'MPiRE',
    id: '22f1835e-ba60-4427-a2a1-5c99f04b13c5',
    color: '#990A0A'
  },
  {
    text: 'TackLING',
    id: '3c5331e6-13a8-4445-a4eb-a4d84054e395',
    color: '#9D25CA'
  },
  {
    text: 'CM',
    id: '102d533f-a760-4a4e-9746-b67d3e64b49a',
    color: '#0A741A'
  },
  {
    text: 'GF',
    id: '18ad0dcb-509d-4f89-9594-7cc5a1fba177',
    color: '#A10E41'
  },
  {
    text: 'TEKKEN',
    id: '8d413659-a663-467d-84a0-415c53751817',
    color: '#FF0000'
  }
]

export const locations = {
  'C-huset': {
    id: '550ddbe9-6fa1-49de-9336-01744c67b233',
    value: '550ddbe9-6fa1-49de-9336-01744c67b233',
    text: 'C-huset',
    label: 'C-huset'
  },
  'Områden på campus': {
    id: 'a52889bd-908a-4a60-b432-13b863ff3d0b',
    value: 'a52889bd-908a-4a60-b432-13b863ff3d0b',
    text: 'Områden på campus',
    label: 'Områden på campus'
  },
  'A-huset': {
    id: 'b1a8936a-94a8-4dba-8840-70fcbfda97a8',
    value: 'b1a8936a-94a8-4dba-8840-70fcbfda97a8',
    text: 'A-huset',
    label: 'A-huset'
  },
  'Key-huset': {
    id: '871176f0-52b4-459b-930d-85097727b536',
    value: '871176f0-52b4-459b-930d-85097727b536',
    text: 'Key-huset',
    label: 'Key-huset'
  },
  'Fysik-huset': {
    id: '1bb05d89-75d9-4063-8d81-b79d7ee69e1f',
    value: '1bb05d89-75d9-4063-8d81-b79d7ee69e1f',
    text: 'Fysik-huset',
    label: 'Fysik-huset'
  },
  'I-huset': {
    id: 'a992802d-e580-4b15-b0ca-070097c809fc',
    value: 'a992802d-e580-4b15-b0ca-070097c809fc',
    text: 'I-huset',
    label: 'I-huset'
  },
  Studenthuset: {
    id: '8e5c3fd8-77b5-470b-b020-e7be3be72676',
    value: '8e5c3fd8-77b5-470b-b020-e7be3be72676',
    text: 'Studenthuset',
    label: 'Studenthuset'
  },
  'B-huset': {
    id: '5586e0a9-91ea-4539-b6f8-19edc139e805',
    value: '5586e0a9-91ea-4539-b6f8-19edc139e805',
    text: 'B-huset',
    label: 'B-huset'
  },
  Kårhus: {
    id: 'de6ebd1a-eb0b-4de4-b549-bc57bb9fadf5',
    value: 'de6ebd1a-eb0b-4de4-b549-bc57bb9fadf5',
    text: 'Kårhus',
    label: 'Kårhus'
  },
  'Övriga områden på campus': {
    id: '3b651c71-3202-47e8-8b94-d5ba7175b1d0',
    value: '3b651c71-3202-47e8-8b94-d5ba7175b1d0',
    text: 'Övriga områden på campus',
    label: 'Övriga områden på campus'
  }
}

export const corridorsC = {
  U: {
    text: 'U-korridoren',
    id: '9aed8b11-542e-4583-91c7-17d8d5ea57a7',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233'
  },
  T: {
    text: 'T-korridoren',
    id: 'b1e4cd20-2857-416a-9c32-7a35544ff8ea',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233'
  },
  S: {
    text: 'S-korridoren',
    id: '2c57a3c8-3ad0-40bc-941c-44f79d7f84d1',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233'
  },
  P: {
    text: 'P-korridoren',
    id: 'a029293e-f391-4922-a31a-dd1f9b564925',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233'
  },
  R: {
    text: 'R-korridoren',
    id: '74897fa9-0158-4e46-8501-6e7a36b50753',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233'
  }
}

export const roomsC = [
  ...Object.values(corridorsC),
  /* U-korridoren */
  {
    text: 'U1',
    id: 'c9394b56-0e30-4b95-a821-ac33d7e632fc',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.U.id
  },
  {
    text: 'U2',
    id: '3ddd9c1a-e684-4a73-8bc0-01da4ffeee92',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.U.id
  },
  {
    text: 'U3',
    id: 'd2e62e84-9688-49c4-95af-e2aae8913601',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.U.id
  },
  {
    text: 'U4',
    id: '1ba1f71d-2eab-4ca3-a68d-5ddc6a1462d4',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.U.id
  },
  {
    text: 'U6',
    id: 'bc58d88b-2b23-4f2e-886a-240b9cb8c8f6',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.U.id
  },
  {
    text: 'U7',
    id: '2823ef49-bc8b-4c96-bdac-10120326461c',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.U.id
  },
  {
    text: 'U10',
    id: '7bedd705-3453-4e18-a479-e16506e99577',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.U.id
  },
  {
    text: 'U11',
    id: 'a04f5f8e-533b-4e32-87fb-47460c5808af',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.U.id
  },
  {
    text: 'U14',
    id: '33150af1-2add-4334-b91e-9909de5547ad',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.U.id
  },
  {
    text: 'U15',
    id: 'e64d9976-f1bb-4998-b257-e79640b2de80',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.U.id
  },
  /* T-korridoren */
  {
    text: 'T1',
    id: '9e0ea521-353d-45b1-8240-9db22c45ab6a',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.T.id
  },
  {
    text: 'T2',
    id: 'b61d88b0-3252-4539-814a-1a6665c755db',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.T.id
  },
  {
    text: 'T11',
    id: 'f01cefaa-bb80-4ecf-8183-604784f08714',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.T.id
  },
  {
    text: 'T15',
    id: '91d25fc3-5b35-48ab-9e2c-1d8e0eb2b5d7',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.T.id
  },
  {
    text: 'T19',
    id: '53a39596-28ff-48d3-aa97-2a87abfd3fe4',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.T.id
  },
  {
    text: 'T23',
    id: 'd799a5be-6e4b-4bdf-88e8-b351816aaf4f',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.T.id
  },
  {
    text: 'T27',
    id: '0dbb474f-fbd2-43f7-b560-50903a918623',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.T.id
  },
  /* S-korridoren */
  {
    text: 'S2',
    id: '4ff5191a-88d5-4724-bfd7-13f502fc7f71',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S3',
    id: 'c692f0a8-0036-4dd1-8f89-c640ba327c93',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S6',
    id: 'e5fa1d15-aaea-4cce-816b-a4559a4f18da',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S7',
    id: 'e2d387ce-18e0-4cd3-ad61-6c0f5daf6ba4',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S10',
    id: 'c20a559d-7ffc-4f34-acc2-837f9d567301',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S11',
    id: '9cac73bb-0ce2-4038-965d-01cde36c2bdd',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S14',
    id: '56bf1526-07d6-4717-a0d5-f320a054e202',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S15',
    id: '9e38a134-f9d0-4c8e-b4e1-233195020d89',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S18',
    id: 'c3d5f22e-e53a-4aa7-aaa7-ba8f4cca0271',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S19',
    id: 'c277ae20-1dcd-4788-a151-b82ecce886f2',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S22',
    id: '781f5d64-f321-4ec4-95a3-089801823b4c',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S23',
    id: '8a083d1e-98b2-4ea9-bf4a-24b4d087ff71',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S25',
    id: 'a751332b-427f-4232-ae19-e9f36f5f936b',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S26',
    id: '21338b84-0ddd-4fbd-850e-983053269972',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S27',
    id: 'b8870cdd-870d-4914-8646-4b3633bb185a',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S35',
    id: '74d6e87f-01ea-4f53-aa69-320f89f6085d',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S37',
    id: 'f85dd2c6-1c74-43cd-b5ec-a102617945fa',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'S41',
    id: '97943225-0624-4c1f-aaba-779e45f9d2db',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  {
    text: 'SG1',
    id: 'fed24a99-8229-4e93-bed3-958eda4a7a4f',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.S.id
  },
  /* R-korridoren */
  {
    text: 'R2',
    id: 'dda18f3b-7fe3-4974-8854-08ac9de06df8',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R6',
    id: '243a0c3d-ad39-451d-ac63-8e6e51cb4a84',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R18',
    id: 'd4bdf8a0-cb39-4992-8cd0-6a2313d13fae',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R19',
    id: 'c862a01a-58cd-4770-b780-b3ab42086af0',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R22',
    id: '7c76e08f-f742-4375-b6e5-c7af16646ce0',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R22',
    id: 'e893e020-5772-4a53-ac8c-eabcf03545e6',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R23',
    id: '49ad1c6b-c47a-4f42-82b6-0a0ba8f4a571',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R26',
    id: 'adfbd30a-6fe1-4cea-9da4-5be0486a9c95',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R27',
    id: '7b0090c4-6e3a-4831-83be-4f67d22fef98',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R34',
    id: '44400255-4777-4520-b90d-1cd952636d46',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R35',
    id: '9b6a29ef-afd9-410c-b177-319356c39084',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R36',
    id: '15a0adcc-648c-4e84-8478-42dcc1803dd4',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R37',
    id: '11c1792e-30b0-4b7a-9fc7-6ecac0b1c86a',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R41',
    id: '7d7a574b-6a87-41d2-b66a-66a6be58d131',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R42',
    id: '2e56a6e8-5530-4dc3-a425-486ac98c1e45',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R43',
    id: 'a5f471e2-cceb-4ef8-ab71-160604c62729',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'R44',
    id: '7ca59a02-b5b3-4535-9c72-47305e8f823c',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'RG1',
    id: 'c779e03d-16d8-47d2-b96d-3416ca1821c7',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'RG2',
    id: '5625d892-cf53-4a32-a2ae-77cfe725835a',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  {
    text: 'RG3',
    id: '056222e1-da15-40f2-9a9e-43d5ab6730c0',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.R.id
  },
  /* P-korridoren */
  {
    text: 'P18',
    id: '69063d3d-d610-470a-be96-1d51a8e388db',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.P.id
  },
  {
    text: 'P22',
    id: '2056c026-2775-4a7d-8207-f2e42e517eef',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.P.id
  },
  {
    text: 'P26',
    id: '8079d7b3-ff42-4cb9-b621-cdd3ebbd3fff',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.P.id
  },
  {
    text: 'P30',
    id: 'd959346b-a33d-4433-a6d4-b4b0a3cde3d3',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.P.id
  },
  {
    text: 'P34',
    id: '233d6abf-e9ee-4c55-a859-93afe5f1bf27',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.P.id
  },
  {
    text: 'P36',
    id: '50602537-dca2-402f-b634-176e666030d1',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.P.id
  },
  {
    text: 'P42',
    id: '60a6c054-53a6-459c-8268-cf74589c8124',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.P.id
  },
  {
    text: 'P44',
    id: '905dc9a6-454f-4037-896c-325e11aae40f',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.P.id
  },
  {
    text: 'PG1',
    id: '31dc1ed5-4b66-4212-9350-b63f073d2bb0',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.P.id
  },
  {
    text: 'PG2',
    id: 'e66f3800-4f10-49d8-b76c-eaf785f55c21',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233',
    corridorId: corridorsC.P.id
  },
  /* Föreläsningsalar + collo */
  {
    text: 'C1',
    id: '739920e4-c605-4bdf-b5c4-f996a62a2b19',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233'
  },
  {
    text: 'C2',
    id: '6f2d17dd-3ff4-4b05-bd13-17328a30f3ae',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233'
  },
  {
    text: 'C3',
    id: 'd732baeb-4ddb-4993-ab7f-6a96182e0379',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233'
  },
  {
    text: 'C4',
    id: 'b6cfe220-0f02-4aca-8f4f-345cb398aea8',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233'
  },
  {
    text: 'Colosseum',
    id: '64f74234-8e86-4d99-827c-deb4774c809a',
    locationId: '550ddbe9-6fa1-49de-9336-01744c67b233'
  }
]

const roomsA = [
  {
    text: 'A1',
    id: 'b055ca05-8247-49ab-8f44-5ef956d6e928',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A2',
    id: 'e16648a0-6d80-4d0e-b448-6554f306258b',
    locationId: locations['A-huset'].id
  },
  {
    text: 'ACAS',
    id: '0597444e-4145-4f46-bac6-22b661d2d459',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A23',
    id: 'f60028ff-5ee2-4850-8b72-037dba02c0cf',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A24',
    id: 'e1777750-022e-4c7e-9c4d-eb6ae70ca8aa',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A25',
    id: 'e1488830-f90a-4e9e-ab62-4d69ad854e9d',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A35',
    id: '5caccf48-7d4a-465f-8586-512bd15e9d44',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A36',
    id: 'c29d82da-c58a-43e7-a15e-68ec994026cb',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A37',
    id: 'd117aadd-07f5-46d7-aedf-f3843206d3a4',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A38',
    id: '7b55698c-a294-4d4f-9376-9a97bc160142',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A31',
    id: 'c8b39a30-4459-411f-93fe-a8c826412a7a',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A32',
    id: '2b70e53a-a5cb-4bff-8c47-80c8544f0f75',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A33',
    id: 'e69fb2a9-0e7f-48b0-83ba-5f3b8559736f',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A34',
    id: '5e1d5073-3b23-4422-83a0-70668c88ba11',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A303',
    id: 'a60e2ddc-096d-4c66-95db-9e94d4ab3ecc',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A301',
    id: '0aef7b75-2b7f-47ec-9e88-92b8737b8436',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A302',
    id: 'd2187be2-4a4f-4964-a0b2-5824d872a3fb',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A300',
    id: 'f6a2aed4-04b3-48ba-8179-d6df819b6adc',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A310',
    id: '954f760c-52e6-449a-a2a9-2647f77e2847',
    locationId: locations['A-huset'].id
  },
  {
    text: 'A311',
    id: '20d49e0b-7f02-4b15-8617-1a21771ecd28',
    locationId: locations['A-huset'].id
  },
  {
    text: 'AG21',
    id: '30d1aa43-f74f-46d9-89df-cdabdc804056',
    locationId: locations['A-huset'].id
  },
  {
    text: 'AG24',
    id: 'fdd4dbd4-5a38-47fb-87b5-480d12cb934d',
    locationId: locations['A-huset'].id
  },
  {
    text: 'AG22',
    id: '6ab199a7-22ae-4898-ba58-6a22331182c1',
    locationId: locations['A-huset'].id
  },
  {
    text: 'AG23',
    id: '5f7b1f8c-cef6-4e93-bccb-c0ad1ca22276',
    locationId: locations['A-huset'].id
  },
  {
    text: 'AG32',
    id: '5adcd93e-4d88-435d-8033-68c7165659e4',
    locationId: locations['A-huset'].id
  },
  {
    text: 'AG35',
    id: '769660a4-59c4-4dbf-bf6d-0993c76f0427',
    locationId: locations['A-huset'].id
  },
  {
    text: 'AG31',
    id: '71b377e7-c407-4e97-b458-4e4f0bb0ade8',
    locationId: locations['A-huset'].id
  },
  {
    text: 'AG33',
    id: '90be0bb2-0b2b-4978-8ea7-c111e0c5a4bd',
    locationId: locations['A-huset'].id
  },
  {
    text: 'AG34',
    id: '79412132-b4c5-426b-9855-6fa524444e6b',
    locationId: locations['A-huset'].id
  },
  {
    text: 'AG26',
    id: 'e7e6bfd8-88bd-42ee-bd60-90547587e2f1',
    locationId: locations['A-huset'].id
  }
]

const roomsFysik = [
  {
    text: 'E326',
    id: 'fdedc9fe-0576-4f5f-a9b2-43cbd3f6ac7c',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'E324',
    id: 'a543d851-2fb1-4a5e-add8-38907e790cec',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'E236',
    id: '2aad2b37-149d-470c-9202-fa8408d70a1c',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'FE249',
    id: 'b5b18f43-125a-4ec6-abfc-4ddeaab205db',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'J206/Planck',
    id: '7b6cc053-3eae-4400-b287-ac32dd203544',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'FB113',
    id: 'c13b19f7-e540-4b6f-829f-160f30ba7d94',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'Auger',
    id: '45e0769d-7b57-4af5-8605-5af818b13a9c',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'Avogadros',
    id: '3ca83320-c39f-4400-b2c4-a92cc0552d21',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'FE243',
    id: 'f9d27357-2b86-4e61-b263-457d9f93a867',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'FE245',
    id: '4d7196d2-9473-43de-9fbd-f09a5789544e',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'FE241',
    id: 'bf7fe2c4-b1d2-4132-a783-07ce2178eb11',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'FE244',
    id: '348fd909-4eb7-45f0-a97c-32da19d1c1d6',
    locationId: locations['Fysik-huset'].id
  },
  {
    text: 'FE246',
    id: '984d01fb-dd73-4b6d-a694-c39a90f2a0e0',
    locationId: locations['Fysik-huset'].id
  }
]

const roomsKey = [
  {
    text: 'Key 1',
    id: '0a5c19d6-552b-4032-95db-852bd5614538',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KY35',
    id: '55f3c641-a1e1-4721-ab2f-79c3f5c04a17',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KY34',
    id: '0211a685-a7a6-42ff-a128-6b7baa607cca',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KY21',
    id: '2fd38910-e8c4-4396-bc71-e246ae1f9654',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KY23',
    id: '0d53e901-96bc-4238-8183-e4542b8c937d',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KY24',
    id: '67a22ef8-18ee-47c9-98b2-cab14bb2148c',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KY25',
    id: '075a28bb-e9df-4d58-9138-5d2e543ef23c',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KY26',
    id: 'eb98ae3c-d362-4eb7-a1d0-9cef45e2eca7',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KY31',
    id: '99f093a9-8739-49c8-9048-1b318f253c90',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KY32',
    id: 'b74201ff-65c2-41be-9187-92e49a9ea9f6',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KY33',
    id: 'c1218d82-8bc0-49c3-80b2-af28903fa508',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG21',
    id: '5c0441fe-6bb2-4050-848f-b5bddf5d3bc5',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG22',
    id: '0e435ad2-298a-4e0c-ba68-0c8d50d182d4',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG23',
    id: '46b7f655-dd3f-42f6-a125-04e340ebc649',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG31',
    id: 'efcc209d-6e61-42be-b1f4-b95ce36a556a',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG32',
    id: '3174abff-1f4d-44d9-bee5-493beb0e517f',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG33',
    id: '550592a8-69db-4a14-ac44-612f4da6bb40',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG36',
    id: 'ad18e633-bba0-4d17-8e15-4d5a8e03bc9c',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG37',
    id: 'ada5ef9b-2991-495b-ac5a-3d613a1c8544',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG43',
    id: '9049baee-a968-49fd-979f-c7478a57487c',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG44',
    id: '58b544e4-3d6c-4fa7-a6ca-bf6f5ddbca9c',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG41',
    id: '3d738782-d1f6-4caa-955c-96f0099fc7ed',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG42',
    id: '0a4a43b1-8a17-4167-a7d2-cd3f314ba67a',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG45',
    id: '466d4dee-fb57-4a6c-a7cc-b46072eb777b',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG46',
    id: '1140c74d-97e3-4741-8c84-5bfaf507c5b9',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG47',
    id: '2f104da6-d16b-4f57-ade1-455fd16870ef',
    locationId: locations['Key-huset'].id
  },
  {
    text: 'KG48',
    id: 'dd259c44-4277-4094-870e-fb8d594fb781',
    locationId: locations['Key-huset'].id
  }
]

const roomsI = [
  {
    text: 'I101',
    id: '0237b71d-559b-4f14-ba61-521466a69b4f',
    locationId: locations['I-huset'].id
  },
  {
    text: 'I205',
    id: '6402a119-72a8-48d9-bb89-22ce44572ff8',
    locationId: locations['I-huset'].id
  },
  {
    text: 'I206',
    id: '4e8f8b40-6282-4da5-bd73-ddbab271f545',
    locationId: locations['I-huset'].id
  },
  {
    text: 'I102',
    id: 'd4b646f4-2b10-46d9-9410-cc8564d14be9',
    locationId: locations['I-huset'].id
  },
  {
    text: 'IG10',
    id: '0a1f508f-b4bc-4ef0-b330-43b22c08f583',
    locationId: locations['I-huset'].id
  },
  {
    text: 'IG11',
    id: '3597629d-d984-47a4-8bb0-59cc7e6e2d84',
    locationId: locations['I-huset'].id
  },
  {
    text: 'IG12',
    id: '0d502e8c-0e5f-4f19-ab9b-346a26235bb2',
    locationId: locations['I-huset'].id
  },
  {
    text: 'IG13',
    id: 'e6ae403e-b00c-43cf-ae69-a5e557963999',
    locationId: locations['I-huset'].id
  },
  {
    text: 'IG14',
    id: '070c3a08-602f-4818-8ac4-4316eade50ff',
    locationId: locations['I-huset'].id
  },
  {
    text: 'IG15',
    id: '4212d75d-bf1e-4036-8db1-9b5cce6ac7e7',
    locationId: locations['I-huset'].id
  },
  {
    text: 'IG16',
    id: '93d00218-eff0-4072-85b8-d76182472002',
    locationId: locations['I-huset'].id
  },
  {
    text: 'IG17',
    id: '8823cdad-5995-402c-be2f-ee589c1a9234',
    locationId: locations['I-huset'].id
  },
  {
    text: 'IG20',
    id: '162cd498-fcec-4b96-8684-06a4c3b40e78',
    locationId: locations['I-huset'].id
  },
  {
    text: 'IG21',
    id: '3f1a50c0-ce82-4b06-a738-f516f026d087',
    locationId: locations['I-huset'].id
  }
]

const roomsStudenthuset = [
  {
    text: 'SH62',
    id: '22f2e914-3b53-4eb6-9bcd-8c6e1f0e53ca',
    locationId: locations.Studenthuset.id
  },
  {
    text: 'SH63',
    id: '1178d2ab-6ea0-4ee3-a98f-697ea0223ce3',
    locationId: locations.Studenthuset.id
  },
  {
    text: 'SH407',
    id: '38597f22-e123-4eac-8054-df4f50ba15fb',
    locationId: locations.Studenthuset.id
  },
  {
    text: 'SH408',
    id: 'd17497a0-44a9-4b65-bb0f-540258ddd818',
    locationId: locations.Studenthuset.id
  },
  {
    text: 'SH603',
    id: '3dceb5a4-18ce-4697-a779-6dfc59a70cd8',
    locationId: locations.Studenthuset.id
  },
  {
    text: 'SH604',
    id: '00ee5982-882b-46fa-aa5d-2e5004fb3293',
    locationId: locations.Studenthuset.id
  },
  {
    text: 'SH605',
    id: '58b85357-10b8-4331-bc75-89a99450aff3',
    locationId: locations.Studenthuset.id
  }
]

const roomsB = [
  {
    text: 'BL32',
    id: 'b93cec2c-6da0-4b69-8cf8-a925a8832427',
    locationId: locations['B-huset'].id
  },
  {
    text: 'BL33',
    id: 'fd86f739-d763-440f-a0da-278ca5df39ae',
    locationId: locations['B-huset'].id
  },
  {
    text: 'BL33',
    id: '7d1561b3-9245-434e-ada5-ddde80ba5a4c',
    locationId: locations['B-huset'].id
  },
  {
    text: 'Ada Lovelace',
    id: 'ae945d57-2c9c-4622-9d4e-2c2a205587ce',
    locationId: locations['B-huset'].id
  }
]

const karhus = [
  {
    text: 'HG',
    id: '07f88233-1f48-4781-8d89-2669a80e393d',
    locationId: locations['Kårhus'].id
  },
  {
    text: 'KK - stora salen',
    id: 'c510648d-37a0-4019-87e1-fbbf1b1adf3a',
    locationId: locations['Kårhus'].id
  },
  {
    text: 'KK - lilla salen',
    id: 'd1d12a5b-8bcb-47b2-9450-e0d490aa6a96',
    locationId: locations['Kårhus'].id
  },
  {
    text: 'KK',
    id: 'a232bbef-b3c3-4e0b-9736-3775139578d9',
    locationId: locations['Kårhus'].id
  },
  {
    text: 'Kårallen - matsalen',
    id: 'fa5bc487-5753-48da-beb7-bf6b31b9f94a',
    locationId: locations['Kårhus'].id
  },
  {
    text: 'Kårallen - gasquen',
    id: 'a2f3bf6e-f7a1-4e7a-8c8f-9119a147f558',
    locationId: locations['Kårhus'].id
  },
  {
    text: 'Kårallen - baljan',
    id: '50923589-f79b-4770-ac8b-35fee2a497f2',
    locationId: locations['Kårhus'].id
  },
  {
    text: 'Kårallen',
    id: 'ed559a94-faaf-4daf-b70f-c7439fb989d7',
    locationId: locations['Kårhus'].id
  },
  {
    text: 'Amfi',
    id: 'bc15ae77-59f4-4531-9790-6040f264bb87',
    locationId: locations['Kårhus'].id
  },
  {
    text: 'Blå havet',
    id: '5c7326f1-b3a9-4e62-9a25-923a97cb181f',
    locationId: locations['Kårhus'].id
  }
]

const outsideCampus = [
  {
    text: 'Område 1',
    id: '360c706b-1cd6-4c97-b56c-d5693ef33ede',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 2',
    id: 'a0516a49-397f-42f5-b19e-532e6b6ee009',
    locationId: locations['Områden på campus'].id
  },
    {
    text: 'Område 2',
    id: '4c9b7d91-6543-4f4d-98a0-1c61505f8afe',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 5',
    id: '540dfbb4-6eee-4fda-8ee9-8acbea85f863',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 5',
    id: 'eabc897c-0000-4e62-9abb-8c26b6ceed1b',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 6',
    id: '9e9f9cf2-99f1-4eac-8c2b-3618655379a8',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 7',
    id: '54716e7c-b7fa-4c74-8d0e-145451a9274a',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 8',
    id: '653be46c-6036-4ae4-9f49-1a9bba2eaf85',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 9',
    id: '5a16aee9-7af8-4ff3-8a5e-dbfc8119fa73',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 10',
    id: '29e76602-8bee-4de6-b1cd-334e6e88dcdf',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 11',
    id: '7620439a-a54a-4447-a200-28dc5a852867',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 12',
    id: '3c4f2e6f-8147-4043-bf7c-a8cb5891e868',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 13',
    id: '2e0d2add-249c-4bfd-b884-7ef35665bacb',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 14',
    id: '98930f4d-4c1b-4e3e-b07d-c26819cd7f07',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 15',
    id: '09d597f8-a2c4-40f0-bd6a-3acdbb7d9b7e',
    locationId: locations['Områden på campus'].id
  },
  {
    text: 'Område 16',
    id: '43071551-f1be-4ba1-a9bb-4c65099a25ae',
    locationId: locations['Områden på campus'].id
  },
]

const otherCampus = [
  {
    text: 'Zenit',
    id: '0b92c10a-d6e7-4da0-bd99-44cfc375408c',
    locationId: locations['Övriga områden på campus'].id
  },
  {
    text: 'MatNat-backen',
    id: 'dd329c78-c810-4611-bb27-88042b6c6e5b',
    locationId: locations['Övriga områden på campus'].id
  }
]

export const rooms = [
  ...roomsC,
  ...roomsA,
  ...roomsB,
  ...roomsFysik,
  ...roomsI,
  ...roomsKey,
  ...roomsStudenthuset,
  ...karhus,
  ...outsideCampus,
  ...otherCampus
]
