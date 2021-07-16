import * as constants from "./constants";

export const initialState = {
  fetching: false,
  data: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case constants.SET_HAS_BEEN_SCANNED_REQUEST:
      return { ...state, fetching: true };

    case constants.SET_HAS_BEEN_SCANNED_SUCCESS: {
      let data = state.data.map(attendee => {
        return attendee.id != action.data.id ? attendee : action.data;
      });
      return {
        ...state,
        data,
        fetching: false
      };
    }

    case constants.SET_HAS_BEEN_SCANNED_FAILURE:
      return {
        ...state,
        fetching: false
      };

    case constants.FETCH_SERVERS_REQUEST:
      return { ...state, fetching: true };

    case constants.FETCH_SERVERS_SUCCESS:
      return {
        ...state,
        fetching: false,
        data: action.data
      };

    case constants.FETCH_SERVERS_FAILURE:
      return {
        ...state,
        fetching: false
      };

    case constants.DELETE_ATTENDEE_REQUEST:
      return { ...state, fetching: true };

    case constants.DELETE_ATTENDEE_SUCCESS: {
      let data = state.data.filter(attendee => {
        return attendee.id != action.id;
      });
      return {
        ...state,
        data,
        fetching: false
      };
    }

    case constants.DELETE_ATTENDEE_FAILURE:
      return {
        ...state,
        fetching: false
      };

    default:
      return state;
  }
}
