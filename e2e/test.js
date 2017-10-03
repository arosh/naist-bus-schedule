import test from 'ava';
const webdriverio = require('webdriverio');

class PageObject {
  constructor(browser) {
    this.browser = browser;
  }

  async setDirection(direction) {
    return this.browser.selectByVisibleText(
      'select[name="direction"]',
      direction
    );
  }

  async setBusStop(busStop) {
    return this.browser.selectByVisibleText('select[name="busStop"]', busStop);
  }

  async setTimeTable(timeTable) {
    return this.browser.selectByVisibleText(
      'select[name="timeTable"]',
      timeTable
    );
  }

  async setForms(direction, busStop, timetable) {
    await this.setDirection(direction);
    await this.setBusStop(busStop);
    await this.setTimeTable(timetable);
  }

  async search(target) {
    return this.browser
      .element('.schedule-list > div > ul')
      .isExisting(`li=${target}`);
  }
}

const browser = webdriverio.remote({
  desiredCapabilities: { browserName: 'chrome' },
});

test.before(async t => {
  await browser.init().url('http://localhost:3000');
});

test.after.always(async t => {
  await browser.end();
});

test(async t => {
  t.is(await browser.getTitle(), 'NAIST バス時刻表 / NAIST Bus Schedule');
});

const NAIST行き = 'NAIST行き / To NAIST';
const NAIST発 = 'NAIST発 / From NAIST';
const 北生駒 = '学研北生駒駅 / Gakken Kita Ikoma Station';
const 高の原 = '高の原駅 / Takanohara Station';
const 学園前 = '学園前駅 / Gakuemmae Station';
const 平日 = '平日ダイヤ / weekday';
const 休日 = '休日ダイヤ / weekend';

const data = [
  [NAIST行き, 北生駒, 平日, '06:38', '06:31'],
  [NAIST行き, 北生駒, 休日, '06:31', '06:58'],
  [NAIST行き, 学園前, 平日, '07:06', '06:38'],
  [NAIST行き, 学園前, 休日, '06:58', '06:31'],
  [NAIST行き, 高の原, 平日, '05:45', '07:06'],
  [NAIST行き, 高の原, 休日, '07:54', '08:45'],
  [NAIST発, 北生駒, 平日, '06:52', '06:49'],
  [NAIST発, 北生駒, 休日, '06:49', '06:52'],
  [NAIST発, 学園前, 平日, '06:16', '07:18'],
  [NAIST発, 学園前, 休日, '06:49', '06:16'],
  [NAIST発, 高の原, 平日, '06:17', '06:31'],
  [NAIST発, 高の原, 休日, '08:29', '06:31'],
];

for (const datum of data) {
  test(async t => {
    const page = new PageObject(browser);
    await page.setForms(datum[0], datum[1], datum[2]);
    t.true(await page.search(datum[3]));
    t.false(await page.search(datum[4]));
  });
}
