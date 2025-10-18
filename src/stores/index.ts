import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomWithRefresh } from 'jotai/utils';

import BusScheduleService, {
  type ScheduleKey,
} from '../services/BusScheduleService';
import SplitScheduleService from '../services/SplitScheduleService';
import TimeDiffService from '../services/TimeDiffService';
import HolidayService from '../services/HolidayService';

// 定数は凍結してイミュータブルにする
export const DIRECTION = Object.freeze({
  TO_NAIST: 'to',
  FROM_NAIST: 'from',
} as const);

export const BUS_STOP = Object.freeze({
  KITAIKOMA: 'kitaikoma',
  GAKUEMMAE: 'gakuemmae',
  TAKANOHARA: 'takanohara',
  TOMIGAOKA: 'tomigaoka',
} as const);

export const SCHEDULE = Object.freeze({
  WEEKDAY: 'weekday',
  WEEKEND: 'weekend',
} as const);

export type DirectionValue = (typeof DIRECTION)[keyof typeof DIRECTION];
export type BusStopValue = (typeof BUS_STOP)[keyof typeof BUS_STOP];
export type ScheduleTypeValue = (typeof SCHEDULE)[keyof typeof SCHEDULE];

// サービスのシングルトンインスタンスを作成
const holidayService = new HolidayService();
const busScheduleService = new BusScheduleService();
const splitScheduleService = new SplitScheduleService();
const timeDiffService = new TimeDiffService();

// 初期値の計算
const getInitialScheduleType = () =>
  holidayService.checkIfTodayIsHoliday() ||
  holidayService.checkIfTodayIsWeekend()
    ? SCHEDULE.WEEKEND
    : SCHEDULE.WEEKDAY;

// ローカルストレージに保存するatomを使用（ユーザー設定を保持）
export const directionAtom = atomWithStorage<DirectionValue>(
  'direction',
  DIRECTION.FROM_NAIST
);
export const busStopAtom = atomWithStorage<BusStopValue>(
  'busStop',
  BUS_STOP.KITAIKOMA
);
// スケジュールタイプは日付によって変わるので通常のatomを使用
export const scheduleTypeAtom = atom<ScheduleTypeValue>(getInitialScheduleType());

// TypeScriptのための型
type TimeData = {
  hours: number;
  minutes: number;
  seconds: number;
};

type NextTimeResult = {
  hour: number;
  minute: number;
  second: number;
};

// 時刻表データを取得するatom
export const timeTableAtom = atom(async (get) => {
  const direction = get(directionAtom);
  const busStop = get(busStopAtom);
  const scheduleType = get(scheduleTypeAtom);

  // 方向の正規化
  const canonicalDirection = direction === DIRECTION.FROM_NAIST ? 'to' : 'from';
  const query = `${canonicalDirection}-${busStop}-${scheduleType}`;

  return await busScheduleService.fetch(query as ScheduleKey);
});

// 現在時刻を管理するatom
export const nowAtom = atomWithRefresh<TimeData>((_get) => {
  const date = new Date();
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
});

// 1秒ごとに更新する
nowAtom.onMount = (setAtom) => {
  const interval = setInterval(() => {
    setAtom();
  }, 1000);
  return () => clearInterval(interval);
};

// 次のバスの時刻を計算するatom
export const nextTimeAtom = atom<Promise<NextTimeResult>>(async (get) => {
  const { hours, minutes, seconds } = get(nowAtom);
  const timeTable = await get(timeTableAtom);

  return timeDiffService.getNext(hours, minutes, seconds, timeTable);
});

// 時刻表をマップに変換するatom
export const timeTableMapAtom = atom<Promise<{ [key: string]: string[] }>>(async (get) => {
  const timeTable = await get(timeTableAtom);
  return splitScheduleService.split(timeTable);
});
