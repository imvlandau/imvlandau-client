import { axiosInstance } from "../../instances";
import {
  addNotification,
  addNotifications,
  removeNotification,
  removeNotifications
} from "../../helpers";
import * as constants from "./constants";

export { addNotification, removeNotification };

export const provisionServer = (
  name,
  email,
  mobile,
  companion_1,
  companion_2,
  companion_3,
  companion_4
) => (dispatch, getState) => {
  dispatch({ type: constants.DEPLOY_SERVER_REQUEST });
  return axiosInstance
    .post(`/api/attendees/create`, {
      name,
      email,
      mobile,
      companion_1,
      companion_2,
      companion_3,
      companion_4
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
