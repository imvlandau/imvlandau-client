import * as constants from "./constants";

export const initialState = {
  fetching: false,
  data: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case constants.DELETE_PARTICIPANT:
      return { ...state, fetching: true };

    case constants.DELETE_PARTICIPANT_SUCCESS: {
      let data = state.data.filter(participant => {
        return participant.id !== action.id;
      });
      return {
        ...state,
        fetching: false,
        data
      };
    }

    case constants.DELETE_PARTICIPANT_FAILURE:
      return {
        ...state,
        fetching: false
      };

    case constants.SET_HAS_BEEN_SCANNED:
      return { ...state, fetching: true };

    case constants.SET_HAS_BEEN_SCANNED_SUCCESS: {
      let data = state.data.map(participant => {
        return participant.id !== action.data.id ? participant : action.data;
      });
      return {
        ...state,
        fetching: false,
        data
      };
    }

    case constants.SET_HAS_BEEN_SCANNED_FAILURE:
      return {
        ...state,
        fetching: false
      };

    case constants.FETCH_PARTICIPANTS:
      return { ...state, fetching: true };

    case constants.FETCH_PARTICIPANTS_SUCCESS:
      return {
        ...state,
        fetching: false,
        data: action.data
      };

    case constants.FETCH_PARTICIPANTS_FAILURE:
      return {
        ...state,
        fetching: false
      };

    default:
      return state;
  }
}
