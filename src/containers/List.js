// @flow
import { inject } from 'mobx-react';
import List from '../components/List';
import type { Stores } from '../stores';

export default inject(({ timeTableStore }: Stores) => ({
  scheduleMap: timeTableStore.timeTableMap,
}))(List);
