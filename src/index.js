// @flow
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorker from './registerServiceWorker';
import App from './containers/App';
import './assets/css/theme.css';

document.addEventListener('DOMContentLoaded', () => {
  const elem = document.getElementById('react-root');
  if (elem) {
    const root = ReactDOM.createRoot(elem);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});

serviceWorker.unregister();
