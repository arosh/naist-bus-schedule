// @flow
import Dispatcher from './Dispatcher';
import BusScheduleService from '../services/BusScheduleService';
import SplitScheduleService from '../services/SplitScheduleService';

export async function updateSchedule(query: string) {
  const schedule = await BusScheduleService.fetch(query);
  const scheduleMap = SplitScheduleService.split(schedule);
  Dispatcher.dispatch({
    type: 'UPDATE_SCHEDULE',
    value: {
      schedule,
      scheduleMap,
    },
  });
}
