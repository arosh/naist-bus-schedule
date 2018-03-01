// @flow
export class TimeDiffService {
  getNext(hour: number, minute: number, second: number, schedule: string[]) {
    const s1 = hour * 60 * 60 + minute * 60 + second;
    for (let i = 0; i < schedule.length; i++) {
      const item = schedule[i];
      const sp = item.split(':');
      const h2 = parseInt(sp[0], 10);
      const m2 = parseInt(sp[1], 10);
      const s2 = h2 * 60 * 60 + m2 * 60;
      if (s1 < s2) {
        const min = s2 - s1;
        return {
          hour: (min / (60 * 60)) | 0,
          minute: ((min / 60) | 0) % 60,
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

export default new TimeDiffService();
