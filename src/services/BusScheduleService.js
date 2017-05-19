// @flow

export default class BusScheduleService {
  /*::
  store: ?{ [string]: string[] }
  */
  constructor() {
    this.store = null;
  }
  async fetch(key: string): Promise<string[]> {
    if (this.store) {
      return this.store[key];
    }
    this.store = await import('../resources/data.json');
    return this.store[key];
  }
}
