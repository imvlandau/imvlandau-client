import { reducer as toastrReducer, initialState as toastr } from "./helpers";
import {
  reducer as serverReducer,
  initialState as server
} from "./views/server";
import {
  reducer as serversReducer,
  initialState as servers
} from "./views/servers";
import { combineReducers } from "redux";

export default combineReducers({
  server: serverReducer,
  servers: serversReducer,
  toastr: toastrReducer
});

export const initialStates = {
  server,
  servers,
  toastr
};
