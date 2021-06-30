import * as constants from "./constants";

export const initialState = {
  fetching: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case constants.DEPLOY_SERVER_REQUEST:
      return { ...state, fetching: true };

    case constants.DEPLOY_SERVER_SUCCESS:
      return {
        ...state,
        fetching: false
      };

    case constants.DEPLOY_SERVER_FAILURE:
      return {
        ...state,
        fetching: false
      };

    default:
      return state;
  }
}
