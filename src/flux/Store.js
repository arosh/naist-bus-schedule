// @flow
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import HolidayService from '../services/HolidayService';
import * as UseCase from './UseCase';

type TState = {
  schedule: string[],
  scheduleMap: { [hour: string]: string[] },
  form: {
    direction: string,
    busStop: string,
    timeTable: string,
  },
};

type TPayload = {
  type: string,
  schedule?: string[],
  scheduleMap?: { [hour: string]: string[] },
  form?: {
    name: string,
    value: string,
  },
};

function getInitialState(): TState {
  const direction = 'to';
  const busStop = 'kitaikoma';
  const timeTable =
    HolidayService.isTodayHoliday() || HolidayService.isTodayWeekend()
      ? 'weekend'
      : 'weekday';
  return {
    schedule: [],
    scheduleMap: {},
    form: {
      direction,
      busStop,
      timeTable,
    },
  };
}

const initialState = getInitialState();

export function initialize() {
  UseCase.updateSchedule(initialState.form.direction, initialState.form.busStop, initialState.form.timeTable);
}

function reducer(state: TState = initialState, action: TPayload) {
  switch (action.type) {
    case 'UPDATE_SCHEDULE':
      return Object.assign({}, state, {
        schedule: action.schedule,
        scheduleMap: action.scheduleMap,
      });
    case 'form/CHANGE':
      const newForm = Object.assign({}, state.form, {
        [action.form.name]: action.form.value,
      });
      return Object.assign({}, state, {
        form: newForm,
      });
    default:
      return state;
  }
}

export default createStore(reducer, composeWithDevTools());
