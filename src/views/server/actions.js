import { axiosInstance } from "../../instances";
import {
  addNotification,
  addNotifications,
  removeNotification,
  removeNotifications
} from "../../helpers";
import * as constants from "./constants";

export { addNotification, removeNotification };

export const getInfrastructureOptions = () => (dispatch, getState) => {
  dispatch({ type: constants.GET_INFRASTRUCTURE_OPTIONS_REQUEST });
  return axiosInstance
    .get(`/api/get/infrastructure/options`)
    .then(response => {
      dispatch({
        type: constants.GET_INFRASTRUCTURE_OPTIONS_SUCCESS,
        hardwarePriceList: response.data.hardwarePriceList,
        startupScripts: response.data.startupScripts,
        keyPairs: response.data.keyPairs,
        locations: response.data.locations,
        operatingSystems: response.data.operatingSystems
      });
    })
    .catch(message => {
      dispatch({ type: constants.GET_INFRASTRUCTURE_OPTIONS_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const getHardwarePriceList = (region, platform) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.GET_HARDWARE_PRICE_LIST_REQUEST });
  return axiosInstance
    .post(`/api/get/hardware/price/list`, {
      region,
      platform
    })
    .then(response => {
      dispatch({
        type: constants.GET_HARDWARE_PRICE_LIST_SUCCESS,
        hardwarePriceList: response.data
      });
    })
    .catch(message => {
      dispatch({ type: constants.GET_HARDWARE_PRICE_LIST_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const createStartupScript = (name, content) => (dispatch, getState) => {
  dispatch({ type: constants.CREATE_STARTUP_SCRIPT_REQUEST });
  return axiosInstance
    .post(`/api/startup/script/create`, {
      name,
      content
    })
    .then(response => {
      dispatch({
        type: constants.CREATE_STARTUP_SCRIPT_SUCCESS,
        startupScripts: response.data.startupScripts
      });
      dispatch(removeNotification("startup_script"));
      return response.data.startupScript;
    })
    .catch(response => {
      dispatch({ type: constants.CREATE_STARTUP_SCRIPT_FAILURE });
      dispatch(addNotifications(response));
      return new Promise(() => {});
    });
};

export const createKeyPair = name => (dispatch, getState) => {
  dispatch({ type: constants.CREATE_KEY_PAIR_REQUEST });
  return axiosInstance
    .post(`/api/key/pair/create`, {
      name
    })
    .then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response.data.privateKey])
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}.pem`);
      document.body.appendChild(link);
      link.click();
      dispatch({
        type: constants.CREATE_KEY_PAIR_SUCCESS,
        keyPairs: response.data.keyPairs
      });
      dispatch(removeNotification("key_pair"));
      return response.data.keyPair;
    })
    .catch(response => {
      dispatch({ type: constants.CREATE_KEY_PAIR_FAILURE });
      dispatch(addNotifications(response));
      return new Promise(() => {});
    });
};

export const provisionServer = (
  region,
  ami,
  product,
  startupScript,
  keyPair,
  hostname,
  label,
  softwareKeys
) => (dispatch, getState) => {
  dispatch({ type: constants.DEPLOY_SERVER_REQUEST });
  return axiosInstance
    .post(`/api/server/provision`, {
      pmb_ec2_region: region.name,
      pmb_ec2_ami_id: ami.id,
      pmb_ec2_instance_type: product.instanceType,
      pmb_ec2_startup_script_id: startupScript && startupScript.id,
      pmb_ec2_keypair_id: keyPair && keyPair.id,
      pmb_hostname: hostname,
      pmb_label: label,
      pmb_ec2_software_keys: softwareKeys
    })
    .then(response => {
      dispatch({
        type: constants.DEPLOY_SERVER_SUCCESS
      });
      dispatch(removeNotifications());
      // return response;
    })
    .catch(response => {
      dispatch({ type: constants.DEPLOY_SERVER_FAILURE });
      dispatch(addNotifications(response));
      return new Promise(() => {});
    });
};
