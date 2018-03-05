// @flow
import { inject } from 'mobx-react';
import Next from '../components/Next';
import type { Stores } from '../stores';

export default inject(({ timeTableStore }: Stores) => {
  if (timeTableStore.nextHour !== -1) {
    return {
      exist: true,
      hour: timeTableStore.nextHour,
      minute: timeTableStore.nextMinute,
      second: timeTableStore.nextSecond,
    };
  }
  return {
    exist: false,
  };
})(Next);
