import test from 'ava';
const webdriverio = require('webdriverio');

class PageObject {
  constructor(browser) {
    this.browser = browser;
  }

  async setDirection(direction) {
    return this.browser.selectByVisibleText(
      '#react-root > div > form > div:nth-child(1) > div > select',
      direction
    );
  }

  async setBusStop(busStop) {
    return this.browser.selectByVisibleText(
      '#react-root > div > form > div:nth-child(2) > div > select',
      busStop
    );
  }

  async setTimetable(timetable) {
    return this.browser.selectByVisibleText(
      '#react-root > div > form > div:nth-child(3) > div > select',
      timetable
    );
  }

  async setForms(direction, busStop, timetable) {
    await this.setDirection(direction);
    await this.setBusStop(busStop);
    await this.setTimetable(timetable);
  }

  async waitForListExists() {
    return this.browser.waitForExist('#react-root > div > div > ul');
  }

  async search(target) {
    return this.browser
      .element('#react-root > div > div > ul')
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

test.serial(async t => {
  t.is(await browser.getTitle(), 'NAIST Bus Schedule');
});

const data = [
  ['To NAIST', 'Gakken Kita Ikoma', 'for weekday', '06:38', '06:31'],
  ['To NAIST', 'Gakken Kita Ikoma', 'for weekend', '06:31', '06:58'],
  ['To NAIST', 'Gakuemmae', 'for weekday', '07:06', '06:38'],
  ['To NAIST', 'Gakuemmae', 'for weekend', '06:58', '06:31'],
  ['To NAIST', 'Takanohara', 'for weekday', '05:45', '07:06'],
  ['To NAIST', 'Takanohara', 'for weekend', '07:54', '08:45'],
  ['From NAIST', 'Gakken Kita Ikoma', 'for weekday', '06:52', '06:49'],
  ['From NAIST', 'Gakken Kita Ikoma', 'for weekend', '06:49', '06:52'],
  ['From NAIST', 'Gakuemmae', 'for weekday', '06:16', '07:18'],
  ['From NAIST', 'Gakuemmae', 'for weekend', '06:49', '06:16'],
  ['From NAIST', 'Takanohara', 'for weekday', '06:17', '06:31'],
  ['From NAIST', 'Takanohara', 'for weekend', '08:29', '06:31'],
];

for (const datum of data) {
  test.serial(async t => {
    const page = new PageObject(browser);
    await page.setForms(datum[0], datum[1], datum[2]);
    t.true(await page.search(datum[3]));
    t.false(await page.search(datum[4]));
  });
}
