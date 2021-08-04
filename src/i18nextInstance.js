import i18next from "i18next";
import ChainedBackend from "i18next-chained-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import HttpBackend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend  from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import http from "./services/http";
import common from "./locales/de-DE/common.json";
import home from "./locales/de-DE/home.json";
import participant from "./locales/de-DE/participant.json";

const i18nextInstance = i18next.createInstance();

const bundledResources = {
  "de-DE": {
    common,
    home,
    participant
  }
};

i18nextInstance
  .use(ChainedBackend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(
    {
      lng: "de-DE",
      fallbackLng: "en-US",
      // fallbackLng: false,
      load: "currentOnly",
      initImmediate: false, // https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
      // partialBundledLanguages: true,
      // preload: ["de-DE"],
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
        backends: [
          resourcesToBackend(bundledResources),
          LocalStorageBackend,
          HttpBackend
        ],
        backendOptions: [{
            // options for resourcesToBackend
          },
          {
            // options for LocalStorageBackend
            prefix: "imv_resource_", // prefix for stored languages
            expirationTime: process.env.NODE_ENV === "production" ? 4 * 24 * 60 * 60 * 1000 : 0 // 4 days
          },
          {
            // options for HttpBackend
            loadPath: "/locales/{{lng}}/{{ns}}.json"
          }
        ],
      },
      react: {
        useSuspense: false
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
