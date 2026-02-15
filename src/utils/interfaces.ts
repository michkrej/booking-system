import { type committees, type kårer } from "@data/committees";
import { BOOKABLE_ITEM_OPTIONS } from "./CONSTANTS";

export type Room = {
  name: string;
  id: string;
  corridorId?: string;
};

export type CorridorC = Record<
  "U" | "T" | "S" | "P" | "R",
  {
    text: string;
    id: string;
    locationId: string;
  }
>;

export type Location = {
  id: string;
  name: string;
  rooms: Room[];
};

export interface DBPlan extends EditablePlanDetails {
  label: string;
  public: boolean;
  committeeId: keyof typeof committees;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  year: number;
  events: Booking[];
}

export type EditablePlanDetails = Pick<
  DBPlan,
  "label" | "public" | "committeeId"
>;

export type Plan = DBPlan & {
  id: string;
};

export type Booking = {
  id: string;
  title: string;
  allDay: boolean;
  description?: string;
  committeeId: keyof typeof committees;
  planId: string;
  startDate: Date;
  endDate: Date;
  locationId: string;
  roomId: string[];

  createdAt: Date;
  updatedAt: Date;

  alcohol: boolean;
  food: boolean;
  link: string;

  bookableItems?: BookableItem[];

  // items
  /*   grillar: number;
  bardiskar: number;
  scenes: number;
  "bankset-hg": number;
  "bankset-k": number;
  "bankset-hoben": number;
  "ff-tents": number;
  "ff-elverk": number;
  "ff-trailer": number; */
};

export type BookableItemNames = (typeof BOOKABLE_ITEM_OPTIONS)[number]["key"];

// Separate keys for clarity and maintainability
export type NumericBookableKeys =
  | "bardiskar"
  | "grillar"
  | "bankset-hg"
  | "bankset-k"
  | "bankset-hoben";
export type TextBookableKeys = "ff" | "forte" | "other-inventory";

// Use a discriminated union for better type safety
export type NumericBookableItem = {
  key: Extract<BookableItemNames, NumericBookableKeys>;
  value: number;
  startDate: Date;
  endDate: Date;
  type: "numeric";
};

export type TextBookableItem = {
  key: Extract<BookableItemNames, TextBookableKeys>;
  value: string;
  startDate: Date;
  endDate: Date;
  type: "text";
};

// Unified type for bookable items
export type BookableItem = NumericBookableItem | TextBookableItem;

export type NewBooking = {
  endDate: Date;
  startDate: Date;
  roomId: string;
};

export type Kår = keyof typeof kårer;

export type LintekCommitee =
  | "STABEN"
  | "URF"
  | "YF"
  | "MPiRE"
  | "TackLING"
  | "CM"
  | "GF"
  | "TEKKEN"
  | "Mytheriet";
export type ConsensusCommitee =
  | "KraFTen"
  | "Logoped"
  | "ATtityd"
  | "ORGANisationen"
  | "HuvudFadderiet"
  | "Super Faddrarna"
  | "Welcoming Committee"
  | "BMA"
  | "BioMed Master"
  | "Stemcellen";
export type StuffCommitee =
  | "FOUL"
  | "SM"
  | "HRarkiet"
  | "KoMPaSS"
  | "Kognitivet"
  | "FBI"
  | "SCB"
  | "Freud"
  | "SPan"
  | "Players"
  | "Jur6"
  | "MvSek";

export type UserDetails = {
  admin: boolean;
  committeeId: string;
};
export type User = {
  id: string;
  displayName: string | null;
  email: string;
  emailVerified: boolean;
} & UserDetails;

export type AdminSettings = {
  lockPlans: boolean;
  mottagningStart: Record<Kår, Date>;
  bookableItems: Record<string, number>;
};
