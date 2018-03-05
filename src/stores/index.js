// @flow
import {
  observable,
  action,
  computed,
  useStrict,
  autorun,
  runInAction,
} from 'mobx';
import BusScheduleService from '../services/BusScheduleService';
import SplitScheduleService from '../services/SplitScheduleService';
import TimeDiffService from '../services/TimeDiffService';
import HolidayService from '../services/HolidayService';

useStrict(true);

export const DIRECTION = {
  TO_NAIST: 'to',
  FROM_NAIST: 'from',
};

export const BUS_STOP = {
  KITAIKOMA: 'kitaikoma',
  GAKUEMMAE: 'gakuemmae',
  TAKANOHARA: 'takanohara',
};

export const SCHEDULE = {
  WEEKDAY: 'weekday',
  WEEKEND: 'weekend',
};

export class TimeTableStore {
  @observable direction: string;
  @observable busStop: string;
  @observable scheduleType: string;
  @observable timeTable: string[] = [];
  @observable nowHours = 0;
  @observable nowMinutes = 0;
  @observable nowSeconds = 0;
  @observable nextHour: number;
  @observable nextMinute: number;
  @observable nextSecond: number;

  busScheduleService = new BusScheduleService();
  splitScheduleService = new SplitScheduleService();
  timeDiffService = new TimeDiffService();

  constructor() {
    this.direction = DIRECTION.FROM_NAIST;
    this.busStop = BUS_STOP.KITAIKOMA;
    const holidayService = new HolidayService();
    this.scheduleType =
      holidayService.checkIfTodayIsHoliday() ||
      holidayService.checkIfTodayIsWeekend()
        ? SCHEDULE.WEEKEND
        : SCHEDULE.WEEKDAY;
    autorun(async () => {
      // フォームのfrom, toとresourcesのfrom, toを間違えやすいので注意
      const canonicalDirection = this.direction === 'from' ? 'to' : 'from';
      // prettier-ignore
      const query = `${canonicalDirection}-${this.busStop}-${this.scheduleType}`;
      const timeTable = await this.busScheduleService.fetch(query);
      runInAction(() => {
        this.timeTable = timeTable;
      });
    });
    autorun(() => {
      const diff = this.timeDiffService.getNext(
        this.nowHours,
        this.nowMinutes,
        this.nowSeconds,
        this.timeTable
      );
      runInAction(() => {
        this.nextHour = diff.hour;
        this.nextMinute = diff.minute;
        this.nextSecond = diff.second;
      });
    });
  }

  @computed
  get timeTableMap(): { [string]: string[] } {
    return this.splitScheduleService.split(this.timeTable);
  }

  @action.bound
  setDirection = (direction: string) => {
    this.direction = direction;
  };

  @action.bound
  setBusStop = (busStop: string) => {
    this.busStop = busStop;
  };

  @action.bound
  setScheduleType = (schedule: string) => {
    this.scheduleType = schedule;
  };

  @action.bound
  updateNow = () => {
    const date = new Date();
    this.nowHours = date.getHours();
    this.nowMinutes = date.getMinutes();
    this.nowSeconds = date.getSeconds();
  };
}

// Flow に return type を推論させると DRY でうれしいと思いきや，
// 「any に counterStore が入っている型」に推論されてしまい，全くうれしくない
export type Stores = {
  timeTableStore: TimeTableStore,
};

const createStores: () => Stores = () => ({
  timeTableStore: new TimeTableStore(),
});

export default createStores;
