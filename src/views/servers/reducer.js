import * as constants from "./constants";

export const initialState = {
  fetching: false,
  data: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
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

    default:
      return state;
  }
}
