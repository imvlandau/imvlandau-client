import React, { Suspense } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import history from "./utils/history";
import { Auth0Provider } from "./react-auth0-spa";
import { i18nextInstance } from "./instances";
import { I18nextProvider } from "react-i18next";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import PmbOverlay from "./components/PmbOverlay";

const store = configureStore();

// A function that routes the user to the right place after login
const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const renderApp = () =>
  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18nextInstance}>
        <Auth0Provider
          domain={process.env.REACT_APP_AUTH0_DOMAIN}
          client_id={process.env.REACT_APP_AUTH0_CLIENT_ID}
          redirect_uri={window.location.origin}
          onRedirectCallback={onRedirectCallback}
        >
          <Suspense fallback={<PmbOverlay />}>
            <App />
          </Suspense>
        </Auth0Provider>
      </I18nextProvider>
    </Provider>,
    document.getElementById("root")
  );

renderApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
