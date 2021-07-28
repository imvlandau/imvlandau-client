import * as constants from "./constants";

export const createParticipant = (params, successNotification) => ({type: constants.CREATE_PARTICIPANT_REQUEST, params, successNotification});
export const createParticipantSuccess = qrCodeImageData => ({type: constants.CREATE_PARTICIPANT_SUCCESS, qrCodeImageData});
export const createParticipantFailure = errors => ({type: constants.CREATE_PARTICIPANT_FAILURE, errors});
