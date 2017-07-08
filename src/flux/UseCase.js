// @flow
import store from './Store';
import BusScheduleService from '../services/BusScheduleService';
import SplitScheduleService from '../services/SplitScheduleService';

export async function changeSchedule(
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
  changeSchedule(form.direction, form.busStop, form.timeTable);
}

export function changeCurrentTime() {
  const date = new Date();
  store.dispatch({
    type: 'UPDATE_CURRENT_TIME',
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  });
}
