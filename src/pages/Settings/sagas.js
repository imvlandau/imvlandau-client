import { put, takeLatest, call } from "redux-saga/effects";
import * as actions from "./actions";
import * as constants from "./constants";
import SettingsService from "./service";
import { addNotification, addNotifications } from "../../containers/Notifications";

function* onSaveSettings(action) {
  try {
    yield call(SettingsService.saveSettings, action);
    yield put(actions.saveSettingsSuccess(action.params));
    yield put(addNotification(action.successNotification));
  } catch (errors) {
    yield put(actions.saveSettingsFailure(errors));
  }
}

function* onSaveSettingsFailure(action) {
    yield put(addNotifications(action.errors));
}

function* onFetchSettings() {
  try {
    const response = yield call(SettingsService.fetchSettings);
    yield put(actions.fetchSettingsSuccess(response));
  } catch (errors) {
    yield put(actions.fetchSettingsFailure(errors));
  }
}

function* onFetchSettingsFailure(action) {
    yield put(addNotifications(action.errors));
}

export default function* watchActions() {
  yield takeLatest(constants.SAVE_SETTINGS, onSaveSettings);
  yield takeLatest(constants.SAVE_SETTINGS_FAILURE, onSaveSettingsFailure);
  yield takeLatest(constants.FETCH_SETTINGS, onFetchSettings);
  yield takeLatest(constants.FETCH_SETTINGS_FAILURE, onFetchSettingsFailure);
}
