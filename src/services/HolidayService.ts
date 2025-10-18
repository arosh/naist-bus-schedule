import * as Holiday from '@holiday-jp/holiday_jp';

export default class HolidayService {
  // 以下のようなコードを書くことで日付を上書きできる
  // const holidayService = new HolidayService();
  // holidayService.getToday = () => new Date(2017, 4, 5);
  getToday(): Date {
    return new Date();
  }
  
  checkIfTodayIsHoliday(): boolean {
    const today = this.getToday();
    return Holiday.isHoliday(today);
  }
  
  checkIfTodayIsWeekend(): boolean {
    const today = this.getToday();
    const day = today.getDay();
    return day === 0 || day === 6;
  }
}
