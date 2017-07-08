// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import * as registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import store from './flux/Store';
import { Provider } from 'react-redux';
import './assets/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('react-root')
);

registerServiceWorker.unregister();
