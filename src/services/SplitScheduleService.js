// @flow
export class SplitScheduleService {
  split(schedule: string[]): { [hour: string]: string[] } {
    const map: { [hour: string]: string[] } = {};
    for (const item of schedule) {
      const split = item.split(':');
      const hour = split[0];
      const key = `${hour}:00 − ${hour}:59`;
      if (!(key in map)) {
        map[key] = [];
      }
      map[key].push(item);
    }
    return map;
  }
}

export default new SplitScheduleService();
