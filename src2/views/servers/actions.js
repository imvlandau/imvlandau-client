import { axiosInstance } from "../../instances";
import { addNotifications, removeNotifications } from "../../helpers";
import * as constants from "./constants";

export const setHasBeenScanned = (
  id,
  hasBeenScanned
) => (dispatch, getState) => {
  dispatch({ type: constants.SET_HAS_BEEN_SCANNED_REQUEST });
  return axiosInstance
    .post(
      `/api/attendees/${id}/setHasBeenScanned`,
      {
        hasBeenScanned
      }
    )
    .then(response => {
      dispatch({
        type: constants.SET_HAS_BEEN_SCANNED_SUCCESS,
        data: response.data
      });
      dispatch(removeNotifications());
      return response;
    })
    .catch(response => {
      dispatch({ type: constants.SET_HAS_BEEN_SCANNED_FAILURE });
      return new Promise(() => {});
    });
};

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
