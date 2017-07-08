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

  async setTimetable(timetable) {
    return this.browser.selectByVisibleText(
      'select[name="timeTable"]',
      timetable
    );
  }

  async setForms(direction, busStop, timetable) {
    await this.setDirection(direction);
    await this.setBusStop(busStop);
    await this.setTimetable(timetable);
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
  t.is(await browser.getTitle(), 'NAIST バス時刻表');
});

const data = [
  [
    'To NAIST',
    '学研北生駒駅 / Gakken Kita Ikoma Station',
    'for weekday',
    '06:38',
    '06:31',
  ],
  [
    'To NAIST',
    '学研北生駒駅 / Gakken Kita Ikoma Station',
    'for weekend',
    '06:31',
    '06:58',
  ],
  ['To NAIST', '学園前駅 / Gakuemmae Station', 'for weekday', '07:06', '06:38'],
  ['To NAIST', '学園前駅 / Gakuemmae Station', 'for weekend', '06:58', '06:31'],
  ['To NAIST', '高の原駅 / Takanohara Station', 'for weekday', '05:45', '07:06'],
  ['To NAIST', '高の原駅 / Takanohara Station', 'for weekend', '07:54', '08:45'],
  [
    'From NAIST',
    '学研北生駒駅 / Gakken Kita Ikoma Station',
    'for weekday',
    '06:52',
    '06:49',
  ],
  [
    'From NAIST',
    '学研北生駒駅 / Gakken Kita Ikoma Station',
    'for weekend',
    '06:49',
    '06:52',
  ],
  ['From NAIST', '学園前駅 / Gakuemmae Station', 'for weekday', '06:16', '07:18'],
  ['From NAIST', '学園前駅 / Gakuemmae Station', 'for weekend', '06:49', '06:16'],
  ['From NAIST', '高の原駅 / Takanohara Station', 'for weekday', '06:17', '06:31'],
  ['From NAIST', '高の原駅 / Takanohara Station', 'for weekend', '08:29', '06:31'],
];

for (const datum of data) {
  test(async t => {
    const page = new PageObject(browser);
    await page.setForms(datum[0], datum[1], datum[2]);
    t.true(await page.search(datum[3]));
    t.false(await page.search(datum[4]));
  });
}
