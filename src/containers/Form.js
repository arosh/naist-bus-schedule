// @flow
import { inject } from 'mobx-react';
import Form from '../components/Form';
import type { Stores } from '../stores';

export default inject(({ timeTableStore }: Stores) => ({
  direction: timeTableStore.direction,
  busStop: timeTableStore.busStop,
  scheduleType: timeTableStore.scheduleType,
  onDirectionChange: timeTableStore.setDirection,
  onBusStopChange: timeTableStore.setBusStop,
  onScheduleTypeChange: timeTableStore.setScheduleType,
}))(Form);
