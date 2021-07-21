import axios from "axios";
import i18next from "i18next";
import XHR from "i18next-xhr-backend"; // have a own xhr fallback
import Backend from "i18next-multiload-backend-adapter";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const axiosInstance = axios.create();
const i18nextInstance = i18next.createInstance();

const setAcceptLanguage = lacc => {
  axiosInstance.defaults.headers["Accept-Language"] = lacc;
};

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.data) {
      if (error.response.data.message || error.response.data.exception) {
        console.group("[PMB]");
        error.response.data.message &&
          console.error(error.response.data.message);
        error.response.data.exception &&
          console.error(
            error.response.data.exception.file +
              ":" +
              error.response.data.exception.line
          );
        error.response.data.exception &&
          console.error(error.response.data.exception.trace);
        console.groupEnd();
      }

      return Promise.reject(
        Array.isArray(error.response.data)
          ? error.response.data
          : [error.response.data]
      );
    } else {
      console.group("[PMB]");
      console.error(error.stack);
      console.groupEnd();

      return Promise.reject([
        {
          key: error.toString(),
          message: error.toString(),
          type: "error"
        }
      ]);
    }
  }
);

i18nextInstance
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(
    {
      fallbackLng: "en-US",
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
      setAcceptLanguage(i18nextInstance.language);
    }
  );

export { i18nextInstance, axiosInstance, setAcceptLanguage };
