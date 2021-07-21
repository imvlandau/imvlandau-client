import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./rootReducer";

export default function configureStore(preloadedState) {
  let middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(
    rootReducer,
    // The preloadedState argument is only meant to be used for rehydrating state from server or localStorage.
    // Instead: You should let reducers define their own initial state using default parameter
    preloadedState,
    composedEnhancers
  );

  return store;
}
