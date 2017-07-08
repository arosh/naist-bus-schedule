// @flow
import store from './Store';
import BusScheduleService from '../services/BusScheduleService';
import SplitScheduleService from '../services/SplitScheduleService';

export async function updateSchedule(query: string) {
  const schedule = await BusScheduleService.fetch(query);
  const scheduleMap = SplitScheduleService.split(schedule);
  store.dispatch({
    type: 'UPDATE_SCHEDULE',
    schedule,
    scheduleMap,
  });
}
