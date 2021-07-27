import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import i18nextInstance from "./i18nextInstance";
import { I18nextProvider } from "react-i18next";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <I18nextProvider i18n={i18nextInstance}>
          <App />
        </I18nextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
