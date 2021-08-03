import { put, takeLatest, call } from "redux-saga/effects";
import * as actions from "./actions";
import * as constants from "./constants";
import ParticipantService from "./service";
import { addNotification, addNotifications } from "../../containers/Notifications";

function* onCreateParticipant(action) {
  try {
    const response = yield call(ParticipantService.createParticipant, action);
    yield put(actions.createParticipantSuccess(response));
    yield put(addNotification(action.successNotification));
  } catch (errors) {
    yield put(actions.createParticipantFailure(errors));
  }
}

function* onCreateParticipantFailure(action) {
    yield put(addNotifications(action.errors));
}

export default function* watchActions() {
  yield takeLatest(constants.CREATE_PARTICIPANT, onCreateParticipant);
  yield takeLatest(constants.CREATE_PARTICIPANT_FAILURE, onCreateParticipantFailure);
}
