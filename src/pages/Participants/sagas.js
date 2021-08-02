import { put, takeLatest, call } from "redux-saga/effects";
import * as actions from "./actions";
import {
  SET_HAS_BEEN_SCANNED,
  SET_HAS_BEEN_SCANNED_FAILURE,
  FETCH_PARTICIPANTS,
  FETCH_PARTICIPANTS_FAILURE
} from "./constants";
import ParticipantsService from "./service";
import { addNotifications } from "../../containers/Notifications";

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
  yield takeLatest(SET_HAS_BEEN_SCANNED, onSetHasBeenScanned);
  yield takeLatest(SET_HAS_BEEN_SCANNED_FAILURE, onSetHasBeenScannedFailure);
  yield takeLatest(FETCH_PARTICIPANTS, onFetchParticipants);
  yield takeLatest(FETCH_PARTICIPANTS_FAILURE, onFetchParticipantsFailure);
}
