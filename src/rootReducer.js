import { combineReducers } from "redux";
import {
  reducer as participantsReducer,
  initialState as participantsInitialState
} from "./pages/Participants";

export default combineReducers({
  participantsInitialState: participantsReducer
});

export const initialStates = {
  participantsInitialState
};
