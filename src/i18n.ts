import { type Locale, format } from "date-fns";
import { enUS, sv } from "date-fns/locale";
import i18n from "i18next";
// import LngDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enJson from "./locales/en.json";
import svJson from "./locales/sv.json";

export const defaultNS = "default";

export const resources = {
  en: {
    default: enJson,
  },
  sv: {
    default: svJson,
  },
} as const;

i18n
  // pass the i18n instance to react-i18next.
  // .use(LngDetector)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: "sv",
    ns: ["default"],
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    saveMissing: true,
    saveMissingTo: "current",
    missingKeyHandler: (lngs, ns, key) => {
      if (import.meta.env.DEV) {
        console.log(`Missing translation: [${lngs}] ${ns}:${key}`);
      }
    },
    /* detection: {
      caches: ["localStorage", "cookie"],
    }, */
  });

const localeMap: Record<string, Locale> = {
  en: enUS,
  sv: sv,
  // add more languages/locales as needed
};

i18n.services.formatter?.add("DATE_HUGE", (value, lng) => {
  const locale = localeMap[lng as string] || enUS;
  return format(value, "PPPP", { locale });
});

export default i18n;
