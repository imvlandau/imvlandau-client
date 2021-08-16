import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

export const useHttp = () => {
  const { getAccessTokenSilently } = useAuth0();

  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

  // request interceptor to add token to request headers
  instance.interceptors.request.use(
    async config => {
      console.log(config);
      const token = await getAccessTokenSilently();
      console.log(token);

      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`
        };
        config.headers.common.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function(error) {
      console.log('error', error);
      return Promise.reject(error);
    },
    // error => Promise.reject(error)
    // , { synchronous: true }
  );

  instance.interceptors.response.use(
    function(successRes) {
      console.log('successRes', successRes);
      return successRes;
    },
    function(error) {
      console.log('error', error);
      return Promise.reject(error);
    }
  );

  return {
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
};
