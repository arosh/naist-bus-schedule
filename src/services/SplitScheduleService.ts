export default class SplitScheduleService {
  split(schedule: string[]): { [hour: string]: string[] } {
    const map: { [hour: string]: string[] } = {};
    for (let i = 0; i < schedule.length; i++) {
      const item = schedule[i];
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
