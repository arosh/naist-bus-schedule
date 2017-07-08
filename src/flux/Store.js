// @flow
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

type TState = {
  schedule: string[],
  scheduleMap: { [hour: string]: string[] },
};

type TPayload = {
  type: string,
  schedule?: string[],
  scheduleMap?: { [hour: string]: string[] },
};

const initialState: TState = {
  schedule: [],
  scheduleMap: {},
};

function reducer(state: TState = initialState, action: TPayload) {
  switch (action.type) {
    case 'UPDATE_SCHEDULE':
      return Object.assign({}, state, {
        schedule: action.schedule,
        scheduleMap: action.scheduleMap,
      });
    default:
      return state;
  }
}

export default createStore(reducer, composeWithDevTools());
