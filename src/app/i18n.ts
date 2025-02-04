import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";

import zodEn from "zod-i18n-map/locales/en/zod.json";
import zodRu from "zod-i18n-map/locales/ru/zod.json";
import en from "../../public/locales/en/common.json";
import ru from "../../public/locales/ru/common.json";

const resources = {
  en: { common: en, zod: zodEn },
  ru: { common: ru, zod: zodRu },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV !== "production",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    resources,
    ns: ["common", "zod"],
    defaultNS: "common",
  });

z.setErrorMap(zodI18nMap);

export default i18n;
