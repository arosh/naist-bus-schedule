// @flow
import { ReduceStore } from 'flux/utils';
import Dispatcher from './Dispatcher';

type TState = {
  schedule: string[],
};

type TPayload = {
  type: string,
  value: string[],
};

class Store extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return {
      schedule: [],
    };
  }

  reduce(state: TState, action: TPayload): TState {
    switch (action.type) {
      case 'UPDATE_SCHEDULE':
        return Object.assign({}, state, {
          schedule: action.value,
        });
      default:
        return state;
    }
  }
}

export default new Store();
