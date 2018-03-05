// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from './registerServiceWorker';
import App from './components/App';
import store, { initialize } from './flux/Store';
import * as UseCase from './flux/UseCase';
import './assets/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

initialize();

UseCase.changeCurrentTime();

setInterval(() => {
  UseCase.changeCurrentTime();
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('react-root');
  if (rootEl) {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      rootEl
    );
  }
});

serviceWorker.register();
