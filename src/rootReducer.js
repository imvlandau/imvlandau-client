import { combineReducers } from "redux";
import {
  reducer as notificationsReducer,
  initialState as notifications
} from "./containers/PmbSnackbar";
import {
  reducer as participantsReducer,
  initialState as participants
} from "./pages/Participants";

export default combineReducers({
  notifications: notificationsReducer,
  participants: participantsReducer
});

export const initialStates = {
  notifications,
  participants
};
