import { all } from 'redux-saga/effects';

import settingsSagas from './pages/Settings/sagas';
import participantsSagas from './pages/Participants/sagas';
import participantSagas from './pages/Participant/sagas';

// Merge the sagas together.
// https://github.com/redux-saga/redux-saga/issues/160#issuecomment-308540204
export default function* rootSaga() {
  yield all([
    settingsSagas(),
    participantsSagas(),
    participantSagas(),
  ]);
}
