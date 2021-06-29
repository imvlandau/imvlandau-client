import * as constants from "./constants";

export const initialState = {
  fetching: false,
  servers: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case constants.GET_SERVERS_REQUEST:
      return { ...state, fetching: true };

    case constants.GET_SERVERS_SUCCESS:
      return {
        ...state,
        fetching: false,
        servers: action.servers
      };

    case constants.GET_SERVERS_FAILURE:
      return {
        ...state,
        fetching: false
      };

    default:
      return state;
  }
}
