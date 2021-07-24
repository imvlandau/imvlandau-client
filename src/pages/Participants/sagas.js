import { put, takeLatest, call } from "redux-saga/effects";
import { fetchParticipantsSuccess, fetchParticipantsFailure } from "./actions";
import { FETCH_PARTICIPANTS_REQUEST } from "./constants";
import ParticipantsService from "./service";

function* onLoadParticipants() {
  try {
    const response = yield call(ParticipantsService.getParticipants);
    yield put(fetchParticipantsSuccess(response));
  } catch (error) {
    yield put(fetchParticipantsFailure(error));
  }
}

export default function* watchActions() {
  yield takeLatest(FETCH_PARTICIPANTS_REQUEST, onLoadParticipants);
}
