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
    const resp = await fetch('data.json');
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    this.store = await resp.json();
    return this.store[key];
  }
}
