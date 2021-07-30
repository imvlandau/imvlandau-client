import { put, takeLatest, call } from "redux-saga/effects";
import { fetchParticipantsSuccess, fetchParticipantsFailure } from "./actions";
import { FETCH_PARTICIPANTS_REQUEST, FETCH_PARTICIPANTS_FAILURE } from "./constants";
import ParticipantsService from "./service";
import { addNotifications } from "../../containers/Notifications";

function* onFetchParticipants() {
  try {
    const response = yield call(ParticipantsService.fetchParticipants);
    yield put(fetchParticipantsSuccess(response));
  } catch (errors) {
    yield put(fetchParticipantsFailure(errors));
  }
}

function* onFetchParticipantsFailure(action) {
    yield put(addNotifications(action.errors));
}

export default function* watchActions() {
  yield takeLatest(FETCH_PARTICIPANTS_REQUEST, onFetchParticipants);
  yield takeLatest(FETCH_PARTICIPANTS_FAILURE, onFetchParticipantsFailure);
}
