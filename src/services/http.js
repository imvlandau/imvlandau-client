import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "";
const instance = axios.create({
  baseURL: BASE_URL
});

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
  patch: instance.patch,
  setAcceptLanguage: lacc => {
    instance.defaults.headers["Accept-Language"] = lacc;
  },
  instance
};
