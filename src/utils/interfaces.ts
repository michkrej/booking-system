export type Room = {
  text: string
  id: string
  corridorId?: string
}

export type CorridorC = Record<
  'U' | 'T' | 'S' | 'P' | 'R',
  {
    text: string
    id: string
    locationId: string
  }
>

export type Plan = {
  id: string
  committeeId: string
  createdAt: string
  label: string
  public: boolean
  userId: string
  year: number
}

export type PlanEvent = {
  id: string
  allDay: boolean
  committeeId: string
  startDate: string
  endDate: string
  locationId: string
  planId: string
  roomId: string[]
  text: string
  userId: string

  createdAt: Date
  updatedAt: Date

  alcohol?: boolean
  food?: boolean
  link?: string
  annat: string
  // items
  grillar?: number
  bardiskar?: number
  'bankset-hg'?: number
  'bankset-k'?: number
  trailer?: number
  tents?: number
  scene?: number
  elverk?: number
}

export type LintekCommitee = 'STABEN' | 'URF' | 'YF' | 'MPiRE' | 'TackLING' | 'CM' | 'GF' | 'TEKKEN'
export type ConsensusCommitee =
  | 'KraFTen'
  | 'Logoped'
  | 'ATtityd'
  | 'ORGANisationen'
  | 'HuvudFadderiet'
  | 'Super Faddrarna'
  | 'Welcoming Committee'
  | 'BMA'
  | 'BioMed Master'
export type StuffCommitee =
  | 'FOUL'
  | 'SM'
  | 'HRarkin'
  | 'KoMPaSS'
  | 'Kognitivet'
  | 'FBI'
  | 'SCB'
  | 'Freud'
  | 'SPan'
  | 'Players'
  | 'Jur6'
  | 'MvSek'
