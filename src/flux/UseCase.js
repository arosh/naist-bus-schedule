// @flow
import Dispatcher from './Dispatcher';
import BusScheduleService from '../services/BusScheduleService';

export async function updateSchedule(query: string) {
  const schedule = await BusScheduleService.fetch(query);
  Dispatcher.dispatch({
    type: 'UPDATE_SCHEDULE',
    value: schedule,
  });
}
