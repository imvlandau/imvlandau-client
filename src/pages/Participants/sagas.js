import { put, takeLatest, call } from "redux-saga/effects";
import * as actions from "./actions";
import * as constants from "./constants";
import ParticipantsService from "./service";
import { addNotifications } from "../../containers/Notifications";

function* onDeleteParticipant(action) {
  try {
    yield call(ParticipantsService.deleteParticipant, action);
    yield put(actions.deleteParticipantSuccess(action));
  } catch (errors) {
    yield put(actions.deleteParticipantFailure(errors));
  }
}

function* onDeleteParticipantFailure(action) {
    yield put(addNotifications(action.errors));
}

function* onSetHasBeenScanned(action) {
  try {
    const response = yield call(ParticipantsService.setHasBeenScanned, action);
    yield put(actions.setHasBeenScannedSuccess(response));
  } catch (errors) {
    yield put(actions.setHasBeenScannedFailure(errors));
  }
}

function* onSetHasBeenScannedFailure(action) {
    yield put(addNotifications(action.errors));
}

function* onFetchParticipants() {
  try {
    const response = yield call(ParticipantsService.fetchParticipants);
    yield put(actions.fetchParticipantsSuccess(response));
  } catch (errors) {
    yield put(actions.fetchParticipantsFailure(errors));
  }
}

function* onFetchParticipantsFailure(action) {
    yield put(addNotifications(action.errors));
}

export default function* watchActions() {
  yield takeLatest(constants.DELETE_PARTICIPANT, onDeleteParticipant);
  yield takeLatest(constants.DELETE_PARTICIPANT_FAILURE, onDeleteParticipantFailure);
  yield takeLatest(constants.SET_HAS_BEEN_SCANNED, onSetHasBeenScanned);
  yield takeLatest(constants.SET_HAS_BEEN_SCANNED_FAILURE, onSetHasBeenScannedFailure);
  yield takeLatest(constants.FETCH_PARTICIPANTS, onFetchParticipants);
  yield takeLatest(constants.FETCH_PARTICIPANTS_FAILURE, onFetchParticipantsFailure);
}
