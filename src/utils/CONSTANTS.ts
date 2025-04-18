export const adminError =
  "Möjligheten att skapa och redigera planeringar har låsts av en administratör";

export const color = {
  primary: "#670c47",
  primary75: "#670c47b5",
  primary50: "#670c4778",
  primary25: "#670c473b",
  secondary: "#60a595",
  tertiary: "#818389",
};

export const CURRENT_YEAR = new Date().getFullYear();

export const BOOKABLE_ITEM_OPTIONS: {
  key:
    | "bardiskar"
    | "bankset-hg"
    | "bankset-hoben"
    | "bankset-k"
    | "ff"
    | "forte"
    | "grillar"
    | "other-inventory";
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

export const viewCollisionsPath = "view-collisions";
export const viewPath = "view";
