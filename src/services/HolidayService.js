// @flow

// 他には https://github.com/hitsujiwool/node-holiday-jp などが有望？
import * as holiday_jp from 'holiday_jp';

export class HolidayService {
  // 以下のようなコードを書くことで日付を上書きできる
  // const holidayService = new HolidayService();
  // holidayService.getToday = () => new Date(2017, 4, 5);
  getToday(): Date {
    return new Date();
  }
  isTodayHoliday(): boolean {
    const today = this.getToday();
    return holiday_jp.isHoliday(today);
  }
  isTodayWeekend(): boolean {
    const today = this.getToday();
    const day = today.getDay();
    return day === 0 || day === 6;
  }
}

export default new HolidayService();
