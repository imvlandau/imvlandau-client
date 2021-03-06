import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "";
const instance = axios.create({
  baseURL: BASE_URL
});

export const authorized = (token) => {
   instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   return instance;
}

const http = {
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

export default http;
