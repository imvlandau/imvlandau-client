import * as constants from "./constants";

export const fetchParticipants = () => ({ type: constants.FETCH_PARTICIPANTS_REQUEST });
export const fetchParticipantsSuccess = data => ({ type: constants.FETCH_PARTICIPANTS_SUCCESS, data });
export const fetchParticipantsFailure = data => ({ type: constants.FETCH_PARTICIPANTS_FAILURE, data });
