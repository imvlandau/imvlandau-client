import * as constants from "./constants";

export const setHasBeenScanned = (id, hasBeenScanned) => ({ type: constants.SET_HAS_BEEN_SCANNED, id, hasBeenScanned });
export const setHasBeenScannedSuccess = response => ({ type: constants.SET_HAS_BEEN_SCANNED_SUCCESS, data: response.data });
export const setHasBeenScannedFailure = errors => ({ type: constants.SET_HAS_BEEN_SCANNED_FAILURE, errors });

export const fetchParticipants = () => ({ type: constants.FETCH_PARTICIPANTS });
export const fetchParticipantsSuccess = response => ({ type: constants.FETCH_PARTICIPANTS_SUCCESS, data: response.data });
export const fetchParticipantsFailure = errors => ({ type: constants.FETCH_PARTICIPANTS_FAILURE, errors });
