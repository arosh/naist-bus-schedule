import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const directionValueByLabel = {
  'NAIST行き / To NAIST': 'to',
  'NAIST発 / From NAIST': 'from',
} as const;

type DirectionLabel = keyof typeof directionValueByLabel;

const busStopValueByLabel = {
  '学研北生駒駅 / Gakken Kita Ikoma Station': 'kitaikoma',
  '高の原駅 / Takanohara Station': 'takanohara',
  '学園前駅 / Gakuemmae Station': 'gakuemmae',
  '登美ヶ丘駅 / Tomigaoka Station': 'tomigaoka',
} as const;

type BusStopLabel = keyof typeof busStopValueByLabel;

const scheduleValueByLabel = {
  '平日ダイヤ / weekday': 'weekday',
  '休日ダイヤ / weekend': 'weekend',
} as const;

type ScheduleLabel = keyof typeof scheduleValueByLabel;

type Scenario = [DirectionLabel, BusStopLabel, ScheduleLabel, string, string];

const scenarios: Scenario[] = [
  [
    'NAIST行き / To NAIST',
    '学研北生駒駅 / Gakken Kita Ikoma Station',
    '平日ダイヤ / weekday',
    '06:38',
    '06:31',
  ],
  [
    'NAIST行き / To NAIST',
    '学研北生駒駅 / Gakken Kita Ikoma Station',
    '休日ダイヤ / weekend',
    '06:26',
    '06:50',
  ],
  [
    'NAIST行き / To NAIST',
    '学園前駅 / Gakuemmae Station',
    '平日ダイヤ / weekday',
    '07:06',
    '06:38',
  ],
  [
    'NAIST行き / To NAIST',
    '学園前駅 / Gakuemmae Station',
    '休日ダイヤ / weekend',
    '06:58',
    '06:31',
  ],
  [
    'NAIST行き / To NAIST',
    '高の原駅 / Takanohara Station',
    '平日ダイヤ / weekday',
    '06:42',
    '07:06',
  ],
  [
    'NAIST行き / To NAIST',
    '高の原駅 / Takanohara Station',
    '休日ダイヤ / weekend',
    '08:02',
    '08:45',
  ],
  [
    'NAIST行き / To NAIST',
    '登美ヶ丘駅 / Tomigaoka Station',
    '平日ダイヤ / weekday',
    '07:00',
    '07:30',
  ],
  [
    'NAIST行き / To NAIST',
    '登美ヶ丘駅 / Tomigaoka Station',
    '休日ダイヤ / weekend',
    '08:21',
    '08:40',
  ],
  [
    'NAIST発 / From NAIST',
    '学研北生駒駅 / Gakken Kita Ikoma Station',
    '平日ダイヤ / weekday',
    '06:13',
    '06:49',
  ],
  [
    'NAIST発 / From NAIST',
    '学研北生駒駅 / Gakken Kita Ikoma Station',
    '休日ダイヤ / weekend',
    '06:16',
    '06:49',
  ],
  [
    'NAIST発 / From NAIST',
    '学園前駅 / Gakuemmae Station',
    '平日ダイヤ / weekday',
    '06:52',
    '07:18',
  ],
  [
    'NAIST発 / From NAIST',
    '学園前駅 / Gakuemmae Station',
    '休日ダイヤ / weekend',
    '06:40',
    '06:16',
  ],
  [
    'NAIST発 / From NAIST',
    '高の原駅 / Takanohara Station',
    '平日ダイヤ / weekday',
    '07:29',
    '06:31',
  ],
  [
    'NAIST発 / From NAIST',
    '高の原駅 / Takanohara Station',
    '休日ダイヤ / weekend',
    '08:42',
    '06:31',
  ],
  [
    'NAIST発 / From NAIST',
    '登美ヶ丘駅 / Tomigaoka Station',
    '平日ダイヤ / weekday',
    '19:57',
    '19:15',
  ],
  [
    'NAIST発 / From NAIST',
    '登美ヶ丘駅 / Tomigaoka Station',
    '休日ダイヤ / weekend',
    '19:11',
    '19:45',
  ],
];

async function applySelection(
  page: Page,
  directionLabel: DirectionLabel,
  busStopLabel: BusStopLabel,
  scheduleLabel: ScheduleLabel
): Promise<void> {
  await page
    .getByLabel('Direction')
    .selectOption(directionValueByLabel[directionLabel]);
  await page
    .getByLabel('Bus Stop')
    .selectOption(busStopValueByLabel[busStopLabel]);
  await page
    .getByLabel('Timetable')
    .selectOption(scheduleValueByLabel[scheduleLabel]);
}

test.describe('NAIST bus timetable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.time-table-js')).toBeVisible();
  });

  for (const [
    direction,
    busStop,
    scheduleType,
    expectedTime,
    missingTime,
  ] of scenarios) {
    test(`${direction} - ${busStop} - ${scheduleType}`, async ({ page }) => {
      await applySelection(page, direction, busStop, scheduleType);

      const positive = page.locator('.time-table-js li', {
        hasText: expectedTime,
      });
      await expect(positive).toBeVisible();

      const negative = page.locator('.time-table-js li', {
        hasText: missingTime,
      });
      await expect(negative).toHaveCount(0);
    });
  }
});
