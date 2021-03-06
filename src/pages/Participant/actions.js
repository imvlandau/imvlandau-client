import * as constants from "./constants";

export { fetchSettings } from "../Settings/actions";

export const createParticipant = (params, successNotification) => ({type: constants.CREATE_PARTICIPANT, params, successNotification});
export const createParticipantSuccess = qrCodeImageData => ({type: constants.CREATE_PARTICIPANT_SUCCESS, qrCodeImageData});
export const createParticipantFailure = errors => ({type: constants.CREATE_PARTICIPANT_FAILURE, errors});
