// @flow
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import HolidayService from '../services/HolidayService';
import * as UseCase from './UseCase';

type TState = {
  schedule: string[],
  scheduleMap: { [hour: string]: string[] },
  hour: number,
  minute: number,
  second: number,
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
  hour?: number,
  minute?: number,
  second?: number,
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
  const currentTime = { hour: 0, minute: 0, second: 0 };
  return {
    schedule: [],
    scheduleMap: {},
    ...currentTime,
    form: {
      direction,
      busStop,
      timeTable,
    },
  };
}

const initialState = getInitialState();

export function initialize() {
  UseCase.changeSchedule(
    initialState.form.direction,
    initialState.form.busStop,
    initialState.form.timeTable
  );
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
    case 'UPDATE_CURRENT_TIME':
      return Object.assign({}, state, {
        hour: action.hour,
        minute: action.minute,
        second: action.second,
      });
    default:
      return state;
  }
}

export default createStore(reducer, composeWithDevTools());
