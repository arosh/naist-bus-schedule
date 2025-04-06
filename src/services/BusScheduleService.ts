import schedule from '../resources/data.json';

type ScheduleKeys = keyof typeof schedule;
  
export default class BusScheduleService {  
  async fetch(key: ScheduleKeys): Promise<string[]> {
    // スケジュールデータを取得
    const data = schedule[key];
    if (data) {
      return data;
    } else {
      throw new Error(`Schedule not found for key: ${key}`);
    }
  }
}
