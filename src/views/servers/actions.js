import { axiosInstance } from "../../instances";
import { addNotifications } from "../../helpers";
import * as constants from "./constants";

export const getServers = () => (dispatch, getState) => {
  dispatch({ type: constants.GET_SERVERS_REQUEST });
  return axiosInstance
    .get(`/api/get/servers`)
    .then(response => {
      dispatch({
        type: constants.GET_SERVERS_SUCCESS,
        servers: response.data.servers
      });
    })
    .catch(message => {
      dispatch({ type: constants.GET_SERVERS_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};
