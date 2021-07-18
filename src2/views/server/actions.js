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
  companion1,
  companion2,
  companion3,
  companion4
) => (dispatch, getState) => {
  dispatch({ type: constants.DEPLOY_SERVER_REQUEST });
  return axiosInstance
    .post(
      `/api/attendees/create`,
      {
        name,
        email,
        mobile,
        companion1,
        companion2,
        companion3,
        companion4
      },
      {
        responseType: "blob"
      }
    )
    .then(response => {
      dispatch({
        type: constants.DEPLOY_SERVER_SUCCESS
      });
      dispatch(removeNotifications());
      return URL.createObjectURL(response.data);
    })
    .catch(response => {
      dispatch({ type: constants.DEPLOY_SERVER_FAILURE });

      var reader = new FileReader();
      reader.addEventListener("loadend", function() {
        dispatch(
          addNotifications(JSON.parse(new TextDecoder().decode(reader.result)))
        );
      });
      reader.readAsArrayBuffer(response && response[0]);

      return new Promise(() => {});
    });
};
