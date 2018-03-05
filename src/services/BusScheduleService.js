// @flow
export default class BusScheduleService {
  schedule: ?{ [string]: string[] } = null;
  async fetch(key: string): Promise<string[]> {
    if (this.schedule) {
      return this.schedule[key];
    }
    this.schedule = await import('../resources/data.json');
    return this.schedule[key];
  }
}
