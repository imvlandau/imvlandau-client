import { put, takeLatest, call } from "redux-saga/effects";
import { createParticipantSuccess, createParticipantFailure } from "./actions";
import { CREATE_PARTICIPANT, CREATE_PARTICIPANT_FAILURE } from "./constants";
import ParticipantService from "./service";
import { addNotification, addNotifications } from "../../containers/Notifications";

function* onCreateParticipant(action) {
  try {
    const response = yield call(ParticipantService.createParticipant, action);
    yield put(createParticipantSuccess(response));
    yield put(addNotification(action.successNotification));
  } catch (errors) {
    yield put(createParticipantFailure(errors));
  }
}

function* onCreateParticipantFailure(action) {
    yield put(addNotifications(action.errors));
}

export default function* watchActions() {
  yield takeLatest(CREATE_PARTICIPANT, onCreateParticipant);
  yield takeLatest(CREATE_PARTICIPANT_FAILURE, onCreateParticipantFailure);
}
