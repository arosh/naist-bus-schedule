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

  async waitForListExists() {
    return this.browser.waitForExist('#react-root > div > div > ul');
  }

  async searchList(target) {
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

test(async t => {
  t.is(await browser.isExisting('body'), true);
});

test(async t => {
  const page = new PageObject(browser);
  await page.setDirection('From NAIST');
  await page.setBusStop('Gakken Kita Ikoma');
  await page.setTimetable('for weekday');
  // await page.waitForListExists();
  t.true(await page.searchList('06:16'));
  t.false(await page.searchList('06:38'));
});
