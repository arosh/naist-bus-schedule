// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import BusScheduleService from './services/BusScheduleService';
import './assets/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

const busSchedule = new BusScheduleService();

ReactDOM.render(
  <App busScheduleService={busSchedule} />,
  document.getElementById('react-root')
);

registerServiceWorker();
