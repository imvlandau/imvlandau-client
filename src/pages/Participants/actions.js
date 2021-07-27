import * as constants from "./constants";

export const fetchParticipants = () => ({ type: constants.FETCH_PARTICIPANTS_REQUEST });
export const fetchParticipantsSuccess = response => ({ type: constants.FETCH_PARTICIPANTS_SUCCESS, data: response.data });
export const fetchParticipantsFailure = () => ({ type: constants.FETCH_PARTICIPANTS_FAILURE });
