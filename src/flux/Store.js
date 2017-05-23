// @flow
import { ReduceStore } from 'flux/utils';
import Dispatcher from './Dispatcher';

type TState = {
  schedule: string[],
  scheduleMap: { [hour: string]: string[] },
};

type TPayload = {
  type: string,
  value: {
    schedule: string[],
    scheduleMap: { [hour: string]: string[] },
  },
};

class Store extends ReduceStore<TPayload, TState> {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return {
      schedule: [],
      scheduleMap: {},
    };
  }

  reduce(state: TState, action: TPayload) {
    switch (action.type) {
      case 'UPDATE_SCHEDULE':
        return Object.assign({}, state, {
          schedule: action.value.schedule,
          scheduleMap: action.value.scheduleMap,
        });
      default:
        return state;
    }
  }
}

export default new Store();
