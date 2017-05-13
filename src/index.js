// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import BusScheduleService from './services/BusScheduleService';
import HolidayService from './services/HolidayService';

const busSchedule = new BusScheduleService();

ReactDOM.render(
  <App busScheduleService={busSchedule} />,
  document.getElementById('react-root')
);
