import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunkMiddleware from "redux-thunk";
// import monitorReducersEnhancer from "./enhancers/monitorReducers";
import rootReducer from "./rootReducer";

export default function configureStore(preloadedState) {
  let middlewares = [thunkMiddleware];
  // if (process.env.NODE_ENV === `development`) {
  //   const { createLogger } = require(`redux-logger`);
  //   const logger = createLogger({
  //     duration: true,
  //     diff: true
  //   });
  //   middlewares.push(logger);
  // }
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  // if (process.env.NODE_ENV === `development`) {
  //   enhancers.push(monitorReducersEnhancer);
  // }
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(
    rootReducer,
    // The preloadedState argument is only meant to be used for rehydrating state from server or localStorage.
    // Instead: You should let reducers define their own initial state using default parameter
    preloadedState,
    composedEnhancers
  );

  // if (process.env.NODE_ENV !== "production" && module.hot) {
  //   module.hot.accept("./rootReducer", () => store.replaceReducer(rootReducer));
  // }

  return store;
}
