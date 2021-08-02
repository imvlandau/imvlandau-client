import * as constants from "./constants";

export const initialState = {
  fetching: false,
  activeStep: 0,
  qrCodeImageData: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case constants.CREATE_PARTICIPANT:
      return { ...state, fetching: true };

    case constants.CREATE_PARTICIPANT_SUCCESS:
      return {
        ...state,
        fetching: false,
        qrCodeImageData: action.qrCodeImageData,
        activeStep: 1
      };

    case constants.CREATE_PARTICIPANT_FAILURE:
      return {
        ...state,
        fetching: false
      };

    default:
      return state;
  }
}
