import schedule from '../resources/data.json';

export type ScheduleKey = keyof typeof schedule;

export default class BusScheduleService {
  fetch(key: ScheduleKey): string[] {
    const data = schedule[key];
    if (data) {
      return data;
    }
    throw new Error(`Schedule not found for key: ${key}`);
  }
}
