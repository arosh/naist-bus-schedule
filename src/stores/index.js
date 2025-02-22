// @flow
import {
  observable,
  action,
  computed,
  autorun,
  runInAction,
  makeObservable,
} from 'mobx';
import BusScheduleService from '../services/BusScheduleService';
import SplitScheduleService from '../services/SplitScheduleService';
import TimeDiffService from '../services/TimeDiffService';
import HolidayService from '../services/HolidayService';

export const DIRECTION = {
  TO_NAIST: 'to',
  FROM_NAIST: 'from',
};

export const BUS_STOP = {
  KITAIKOMA: 'kitaikoma',
  GAKUEMMAE: 'gakuemmae',
  TAKANOHARA: 'takanohara',
  TOMIGAOKA: 'tomigaoka',
};

export const SCHEDULE = {
  WEEKDAY: 'weekday',
  WEEKEND: 'weekend',
};

export class TimeTableStore {
  direction: string;
  busStop: string;
  scheduleType: string;
  timeTable: string[] = [];
  nowHours = 0;
  nowMinutes = 0;
  nowSeconds = 0;
  nextHour: number = 0;
  nextMinute: number = 0;
  nextSecond: number = 0;

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

    makeObservable(this, {
      // makeObservable をコンストラクタ内で呼び出す
      direction: observable,
      busStop: observable,
      scheduleType: observable,
      timeTable: observable,
      nowHours: observable,
      nowMinutes: observable,
      nowSeconds: observable,
      nextHour: observable,
      nextMinute: observable,
      nextSecond: observable,
      timeTableMap: computed,
      setDirection: action.bound,
      setBusStop: action.bound,
      setScheduleType: action.bound,
      updateNow: action.bound,
    });

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

  get timeTableMap(): { [string]: string[] } {
    return this.splitScheduleService.split(this.timeTable);
  }

  setDirection = (direction: string) => {
    this.direction = direction;
  };

  setBusStop = (busStop: string) => {
    this.busStop = busStop;
  };

  setScheduleType = (schedule: string) => {
    this.scheduleType = schedule;
  };

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
