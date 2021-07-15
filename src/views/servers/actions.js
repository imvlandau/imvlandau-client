import { axiosInstance } from "../../instances";
import { addNotifications } from "../../helpers";
import * as constants from "./constants";

export const fetchServers = () => (dispatch, getState) => {
  dispatch({ type: constants.FETCH_SERVERS_REQUEST });
  return axiosInstance
    .get(`/api/attendees/fetch`)
    .then(response => {
      dispatch({
        type: constants.FETCH_SERVERS_SUCCESS,
        data: response.data
      });
    })
    .catch(message => {
      dispatch({ type: constants.FETCH_SERVERS_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const deleteAttendee = (id) => (dispatch, getState) => {
  dispatch({ type: constants.DELETE_ATTENDEE_REQUEST });
  return axiosInstance
    .delete(`/api/attendees/delete/${id}`)
    .then(response => {
      dispatch({
        type: constants.DELETE_ATTENDEE_SUCCESS,
        id
      });
      dispatch(removeNotifications());
    })
    .catch(response => {
      dispatch({ type: constants.DELETE_ATTENDEE_FAILURE });
      return new Promise(() => {});
    });
};
