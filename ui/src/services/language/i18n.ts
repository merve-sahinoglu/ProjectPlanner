import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    backend: {
      ns: ["translation"],
      loadPath: "locales/{{lng}}/{{ns}}.json",
    },
    supportedLngs: ["en", "tr"],
    nonExplicitSupportedLngs: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
      format(value, format, lng) {
        if (format === "date") {
          return new Intl.DateTimeFormat(lng).format(value);
        }
        return value;
      },
    },
  });
