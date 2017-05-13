import * as holiday_jp from 'holiday_jp';

export default class HolidayService {
  // 以下のようなコードを書くことで日付を上書きできる
  // const holidayService = new HolidayService();
  // holidayService.getToday = () => new Date(2017, 4, 5);
  getToday() {
    return Date.now();
  }
  isTodayHoliday(): boolean {
    const today = this.getToday();
    return holiday_jp.isHoliday(today)
  }
}
