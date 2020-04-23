// @flow

// fsをPromise化したもの
const fs = require('mz/fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const resourceNames = [
  'from-kitaikoma-weekday',
  'from-kitaikoma-weekend',
  'to-kitaikoma-weekday',
  'to-kitaikoma-weekend',
  'from-takanohara-weekday',
  'from-takanohara-weekend',
  'to-takanohara-weekday',
  'to-takanohara-weekend',
  'from-gakuemmae-weekday',
  'from-gakuemmae-weekend',
  'to-gakuemmae-weekday',
  'to-gakuemmae-weekend',
  'from-tomigaoka-weekday',
  'from-tomigaoka-weekend',
  'to-tomigaoka-weekday',
  'to-tomigaoka-weekend',
];

function parseCsv(content: string): string[] {
  const retval = [];
  const lines = content.split('\n');
  // 時刻表は5時から24時まであるので24-5+1行ある
  for (let i = 0; i < 24 - 5 + 1; i++) {
    const row = lines[i].split(',');
    // 0列目は時, 1列目以降は分
    const prefix = row[0].trim().padStart(2, '0');
    for (let j = 1; j < row.length; j++) {
      const items = row[j].trim().split(/\s/);
      // prettier-ignore
      for (const item of items) {
        if (item.length > 0) {
          const suffix = item.padStart(2, '0');
          retval.push(`${prefix}:${suffix}`);
        }
      }
    }
  }
  retval.sort();
  return retval;
}

async function run() {
  const store = {};
  // prettier-ignore
  for (const resourceName of resourceNames) {
    const filename = path.join(ROOT, 'resources', `${resourceName}.csv`);
    const data = await fs.readFile(filename);
    const content = data.toString();
    store[resourceName] = parseCsv(content);
  }
  const targetFilename = path.join(ROOT, 'src', 'resources', 'data.json');
  await fs.writeFile(targetFilename, JSON.stringify(store));
}

run();
