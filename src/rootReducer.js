import { reducer as toastrReducer, initialState as toastr } from "./helpers";
import {
  reducer as editorReducer,
  initialState as editor
} from "./views/editor";
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
  editor: editorReducer,
  server: serverReducer,
  servers: serversReducer,
  toastr: toastrReducer
});

export const initialStates = {
  editor,
  server,
  servers,
  toastr
};
