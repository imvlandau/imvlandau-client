import i18next from "i18next";
import XHR from "i18next-xhr-backend"; // have a own xhr fallback
import Backend from "i18next-multiload-backend-adapter";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import http from "./services/http";

const i18nextInstance = i18next.createInstance();

i18nextInstance
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(
    {
      fallbackLng: "de-DE",
      load: "currentOnly",
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain"
      ],
      debug: false,
      backend: {
        backend: XHR,
        backendOption: {
          loadPath: "/locales/{{lng}}/{{ns}}.json"
        }
      },
      react: {
        useSuspense: true
      },

      ns: ["common"],
      defaultNS: "common",
      fallbackNS: "common",

      keySeparator: false, // we do not use keys in form messages.welcome
      // keySeparator: ".", // this allows to use nestes message objects
      nsSeparator: ":",

      interpolation: {
        escapeValue: false // not needed for react!!
      }
    },
    (err, t) => {
      http.setAcceptLanguage(i18nextInstance.language);
    }
  );

export default i18nextInstance;
