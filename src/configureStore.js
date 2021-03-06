import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import rootReducer from "./rootReducer";
import rootSaga from './rootSaga';

export default function configureStore(preloadedState) {
  const sagaMiddleware = createSagaMiddleware();
  let middlewares = [sagaMiddleware];
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

  sagaMiddleware.run(rootSaga)

  return store;
}
