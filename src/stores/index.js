import { atom } from 'jotai';

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

const holidayService = new HolidayService();

const initialScheduleType =
  holidayService.checkIfTodayIsHoliday() ||
  holidayService.checkIfTodayIsWeekend()
    ? SCHEDULE.WEEKEND
    : SCHEDULE.WEEKDAY;

export const directionAtom = atom(DIRECTION.FROM_NAIST);
export const busStopAtom = atom(BUS_STOP.KITAIKOMA);
export const scheduleTypeAtom = atom(initialScheduleType);

const busScheduleService = new BusScheduleService();

const timeTableAtom = atom(async (get) => {
  const direction = get(directionAtom);
  const busStop = get(busStopAtom);
  const scheduleType = get(scheduleTypeAtom);
  const canonicalDirection = direction === 'from' ? 'to' : 'from';
  const query = `${canonicalDirection}-${busStop}-${scheduleType}`;
  return await busScheduleService.fetch(query);
});

const initialDate = new Date();

const rawNowAtom = atom({
  hours: initialDate.getHours(),
  minutes: initialDate.getMinutes(),
  seconds: initialDate.getSeconds(),
});

export const nowAtom = atom(
  (get) => {
    return get(rawNowAtom);
  },
  (get, set) => {
    const date = new Date();
    set(rawNowAtom, {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    });
  }
);

nowAtom.onMount = (setAtom) => {
  const interval = setInterval(() => {
    setAtom();
  }, 1000);
  return () => clearInterval(interval);
};

export const nextTimeAtom = atom(async (get) => {
  const timeDiffService = new TimeDiffService();
  const { hours, minutes, seconds } = get(nowAtom);
  const timeTable = await get(timeTableAtom);
  return timeDiffService.getNext(hours, minutes, seconds, timeTable);
});

const splitScheduleService = new SplitScheduleService();

export const timeTableMapAtom = atom(async (get) => {
  return splitScheduleService.split(await get(timeTableAtom));
});
