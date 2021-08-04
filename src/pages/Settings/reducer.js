import * as constants from "./constants";

export const initialState = {
  fetching: false,
  data: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case constants.SAVE_SETTINGS:
      return { ...state, fetching: true };

    case constants.SAVE_SETTINGS_SUCCESS:
      return {
        ...state,
        fetching: false
      };

    case constants.SAVE_SETTINGS_FAILURE:
      return {
        ...state,
        fetching: false
      };

    case constants.FETCH_SETTINGS:
      return { ...state, fetching: true };

    case constants.FETCH_SETTINGS_SUCCESS:
      return {
        ...state,
        fetching: false,
        data: action.data
      };

    case constants.FETCH_SETTINGS_FAILURE:
      return {
        ...state,
        fetching: false
      };

    default:
      return state;
  }
}
