// @flow
import { inject } from 'mobx-react';
import Next from '../components/Next';
import type { Stores } from '../stores';

export default inject(({ timeTableStore }: Stores) => {
  if (timeTableStore.nextHour !== -1) {
    return {
      exist: true,
      hours: timeTableStore.nextHour,
      minutes: timeTableStore.nextMinute,
      seconds: timeTableStore.nextSecond,
    };
  }
  return {
    exist: false,
  };
})(Next);
