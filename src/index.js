// @flow
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'mobx-react';

import * as serviceWorker from './registerServiceWorker';
import App from './containers/App';
import createStores from './stores';
import './assets/css/bootstrap.min.css';

const stores = createStores();

stores.timeTableStore.updateNow();

setInterval(() => {
  stores.timeTableStore.updateNow();
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
  const elem = document.getElementById('react-root');
  if (elem) {
    const root = ReactDOM.createRoot(elem);
    root.render(
      <React.StrictMode>
        <Provider {...stores}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  }
});

serviceWorker.register();
