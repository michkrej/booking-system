import { kårer } from '@/data/committees'
import { FieldValue } from 'firebase/firestore'

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

export interface EditablePlanDetails {
  label: string
  public: boolean
  committeeId: string
}

export interface DBPlan extends EditablePlanDetails {
  createdAt: Date
  updatedAt: Date
  userId: string
  year: number
  events: PlanEvent[]
}

export interface Plan extends DBPlan {
  id: string
}

export type PlanEvent = {
  id: string
  allDay: boolean
  committeeId: string
  planId: string
  startDate: string
  endDate: string
  locationId: string
  roomId: string[]
  text: string

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
export type Kår = keyof typeof kårer

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
  | 'HRarkiet'
  | 'KoMPaSS'
  | 'Kognitivet'
  | 'FBI'
  | 'SCB'
  | 'Freud'
  | 'SPan'
  | 'Players'
  | 'Jur6'
  | 'MvSek'

export interface User {
  userId: string
  displayName: string | null
  email: string
  emailVerified: boolean
  committeeId: string
  admin: boolean
}
