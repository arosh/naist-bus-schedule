// @flow
import Dispatcher from './Dispatcher';

const Actions = {
  updateSchedule(schedule: string[]) {
    Dispatcher.dispatch({
      type: 'UPDATE_SCHEDULE',
      value: schedule,
    });
  },
};

export default Actions;
