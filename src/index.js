// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import BusScheduleService from './services/BusScheduleService';

const busSchedule = new BusScheduleService();

ReactDOM.render(
  <App busScheduleService={busSchedule} />,
  document.getElementById('react-root')
);
