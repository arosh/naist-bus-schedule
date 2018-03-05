// @flow
export default class TimeDiffService {
  // 現在時刻と 'HH:mm:ss' 形式の時刻表を渡すと，現在時刻以降の最初のスケジュールまでの時間を返す
  // 既に終バスが行ってしまっていたら -1, -1, -1 を返す
  getNext(hour: number, minute: number, second: number, schedule: string[]) {
    const s1 = hour * 60 * 60 + minute * 60 + second;
    for (let i = 0; i < schedule.length; i++) {
      const item = schedule[i];
      const sp = item.split(':');
      const h2 = Number.parseInt(sp[0], 10);
      const m2 = Number.parseInt(sp[1], 10);
      const s2 = h2 * 60 * 60 + m2 * 60;
      if (s1 < s2) {
        const min = s2 - s1;
        return {
          hour: Math.floor(min / (60 * 60)),
          minute: Math.floor(min / 60) % 60,
          second: min % 60,
        };
      }
    }
    return {
      hour: -1,
      minute: -1,
      second: -1,
    };
  }
}
