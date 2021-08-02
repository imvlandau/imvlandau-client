import * as constants from "./constants";

export const fetchParticipants = () => ({ type: constants.FETCH_PARTICIPANTS });
export const fetchParticipantsSuccess = response => ({ type: constants.FETCH_PARTICIPANTS_SUCCESS, data: response.data });
export const fetchParticipantsFailure = errors => ({ type: constants.FETCH_PARTICIPANTS_FAILURE, errors });
