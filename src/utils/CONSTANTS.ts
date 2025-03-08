import { type BookableItemName } from "./interfaces";

const adminError =
  "Möjligheten att skapa och redigera planeringar har låsts av en administratör";

const color = {
  primary: "#670c47",
  primary75: "#670c47b5",
  primary50: "#670c4778",
  primary25: "#670c473b",
  secondary: "#60a595",
  tertiary: "#818389",
};

export const CURRENT_YEAR = new Date().getFullYear();

export { adminError, color };

export const itemTranslations: Record<BookableItemName, string> = {
  "bankset-k": "Bänkset (Kårallen)",
  "bankset-hg": "Bänkset (HG)",
  "bankset-hoben": "Bänkset (Hoben)",
  "ff-tents": "FF-tents",
  "ff-elverk": "FF-elverk",
  "ff-trailer": "FF-trailer",
  grillar: "Grillar (Kårallen)",
  bardiskar: "Bardiskar (Kårallen)",
  scenes: "Scenpodier (Kårallen)",
};
