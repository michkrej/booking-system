import type { NumericBookableKeys } from "@/interfaces/interfaces";
import { version } from "../../package.json";

export const CURRENT_APP_VERSION = version;

export const adminError =
  "Möjligheten att skapa och redigera planeringar har låsts av en administratör";

export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_YEAR = 2025;
export const MAX_YEAR = CURRENT_YEAR + 1;

export const BOOKABLE_ITEM_KEYS = [
  "bardiskar",
  "bankset-hg",
  "bankset-hoben",
  "bankset-k",
  "ff",
  "forte",
  "grillar",
  "other-inventory",
] as const;

export const BOOKABLE_ITEM_OPTIONS: {
  key: (typeof BOOKABLE_ITEM_KEYS)[number];
  value: string;
  comment?: string;
  inputType: "text" | "number";
}[] = [
  {
    key: "bardiskar",
    value: "Bardiskar (Kårallen)",
    comment: "Ange antal",
    inputType: "number",
  },
  {
    key: "bankset-hg",
    value: "Bänkset (HG)",
    comment: "Ange antal",
    inputType: "number",
  },
  {
    key: "bankset-hoben",
    value: "Bänkset (Hoben)",
    comment: "Ange antal",
    inputType: "number",
  },
  {
    key: "bankset-k",
    value: "Bänkset (Kårallen)",
    comment: "Ange antal",
    inputType: "number",
  },
  {
    key: "ff",
    value: "FF inventarier",
    comment: "T.ex. topptält, popup tält, elverk, släp etc.",
    inputType: "text",
  },
  {
    key: "forte",
    value: "Forte",
    comment: "T.ex. sittningspaket, två högtalare och en mikrofon etc.",
    inputType: "text",
  },
  {
    key: "grillar",
    value: "Grillar (Kårallen)",
    comment: "Ange antal",
    inputType: "number",
  },
  {
    key: "other-inventory",
    value: "Övriga inventarier",
    comment: "Övriga inventarier för bokningen",
    inputType: "text",
  },
] as const;

export const DEFAULT_ITEMS: Record<NumericBookableKeys, number> = {
  grillar: 8,
  bardiskar: 6,
  "bankset-hg": 20,
  "bankset-k": 25,
  "bankset-hoben": 50,
};

export const viewCollisionsPath = "view-collisions";
export const viewPath = "view";
