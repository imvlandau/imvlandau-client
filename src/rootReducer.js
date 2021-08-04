import { combineReducers } from "redux";
import {
  reducer as notificationsReducer,
  initialState as notifications
} from "./containers/Notifications";
import {
  reducer as settingsReducer,
  initialState as settings
} from "./pages/Settings";
import {
  reducer as participantReducer,
  initialState as participant
} from "./pages/Participant";
import {
  reducer as participantsReducer,
  initialState as participants
} from "./pages/Participants";

export default combineReducers({
  notifications: notificationsReducer,
  settings: settingsReducer,
  participant: participantReducer,
  participants: participantsReducer
});

export const initialStates = {
  notifications,
  settings,
  participant,
  participants
};
