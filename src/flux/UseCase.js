// @flow
import store from './Store';
import BusScheduleService from '../services/BusScheduleService';
import SplitScheduleService from '../services/SplitScheduleService';

export async function updateSchedule(
  direction: string,
  busStop: string,
  timeTable: string
) {
  // フォームのfrom, toとresourcesのfrom, toを間違えやすいので注意
  const canonicalDirection = direction === 'from' ? 'to' : 'from';
  const query = `${canonicalDirection}-${busStop}-${timeTable}`;
  const schedule = await BusScheduleService.fetch(query);
  const scheduleMap = SplitScheduleService.split(schedule);
  store.dispatch({
    type: 'UPDATE_SCHEDULE',
    schedule,
    scheduleMap,
  });
}

export function changeForm(name: string, value: string) {
  store.dispatch({
    type: 'form/CHANGE',
    form: {
      name,
      value,
    },
  });
  const form = Object.assign({}, store.getState().form, {
    [name]: value,
  });
  updateSchedule(form.direction, form.busStop, form.timeTable);
}
