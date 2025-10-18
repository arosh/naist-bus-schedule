import { atom } from 'jotai';
import { atomWithRefresh, atomWithStorage, createJSONStorage } from 'jotai/utils';

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

const DIRECTION_VALUES = Object.values(DIRECTION) as DirectionValue[];
const BUS_STOP_VALUES = Object.values(BUS_STOP) as BusStopValue[];

const createValidatedStringStorageAtom = <T extends string>(
  key: string,
  defaultValue: T,
  allowedValues: readonly T[]
) => {
  const storage =
    typeof window !== 'undefined'
      ? createJSONStorage<T>(() => window.localStorage)
      : undefined;

  const sanitizedStorage =
    storage && {
      ...storage,
      getItem: (storageKey: string, initialValue: T) => {
        const storedValue = storage.getItem(storageKey, initialValue);
        if (allowedValues.includes(storedValue)) {
          return storedValue;
        }
        try {
          storage.setItem(storageKey, defaultValue);
        } catch {
          // Ignore storage write failures (e.g., read-only or quota exceeded)
        }
        return defaultValue;
      },
    };

  return atomWithStorage<T>(key, defaultValue, sanitizedStorage);
};

const directionStorageAtom = createValidatedStringStorageAtom<DirectionValue>(
  'direction',
  DIRECTION.FROM_NAIST,
  DIRECTION_VALUES
);

const busStopStorageAtom = createValidatedStringStorageAtom<BusStopValue>(
  'busStop',
  BUS_STOP.KITAIKOMA,
  BUS_STOP_VALUES
);

// ローカルストレージに保存するatomを使用（ユーザー設定を保持）
export const directionAtom = atom<DirectionValue, [DirectionValue], void>(
  (get) => get(directionStorageAtom),
  (_get, set, nextDirection) => {
    const safeDirection = DIRECTION_VALUES.includes(nextDirection)
      ? nextDirection
      : DIRECTION.FROM_NAIST;
    set(directionStorageAtom, safeDirection);
  }
);

export const busStopAtom = atom<BusStopValue, [BusStopValue], void>(
  (get) => get(busStopStorageAtom),
  (_get, set, nextBusStop) => {
    const safeBusStop = BUS_STOP_VALUES.includes(nextBusStop)
      ? nextBusStop
      : BUS_STOP.KITAIKOMA;
    set(busStopStorageAtom, safeBusStop);
  }
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

// 時刻表参照用のキーを算出するatom
const scheduleKeyAtom = atom<ScheduleKey>((get) => {
  const direction = get(directionAtom);
  const busStop = get(busStopAtom);
  const scheduleType = get(scheduleTypeAtom);

  // UI上の「from NAIST」は時刻表データの "to" を参照する
  const canonicalDirection =
    direction === DIRECTION.FROM_NAIST ? DIRECTION.TO_NAIST : DIRECTION.FROM_NAIST;

  return `${canonicalDirection}-${busStop}-${scheduleType}` as ScheduleKey;
});

// 時刻表データを取得するatom
export const timeTableAtom = atom((get) => {
  const key = get(scheduleKeyAtom);
  return busScheduleService.fetch(key);
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
export const nextTimeAtom = atom<NextTimeResult>((get) => {
  const { hours, minutes, seconds } = get(nowAtom);
  const timeTable = get(timeTableAtom);
  return timeDiffService.getNext(hours, minutes, seconds, timeTable);
});

// 時刻表をマップに変換するatom
export const timeTableMapAtom = atom<{ [key: string]: string[] }>((get) => {
  const timeTable = get(timeTableAtom);
  return splitScheduleService.split(timeTable);
});
