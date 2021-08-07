import * as constants from "./constants";

export const saveSettings = (params, successNotification) => ({type: constants.SAVE_SETTINGS, params, successNotification});
export const saveSettingsSuccess = data => ({type: constants.SAVE_SETTINGS_SUCCESS, data});
export const saveSettingsFailure = errors => ({type: constants.SAVE_SETTINGS_FAILURE, errors});

export const fetchSettings = () => ({ type: constants.FETCH_SETTINGS });
export const fetchSettingsSuccess = response => ({ type: constants.FETCH_SETTINGS_SUCCESS, data: response.data });
export const fetchSettingsFailure = errors => ({ type: constants.FETCH_SETTINGS_FAILURE, errors });
