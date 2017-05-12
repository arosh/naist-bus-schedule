// @flow

// fsをPromise化したもの
const fs = require('mz/fs');
// padStartのpolyfill
require('string.prototype.padstart').shim();

function parseCsv(content /*: string*/) /*: string[]*/ {
  const retval = [];
  const lines = content.split('\n');
  // 時刻表は5時から24時まであるので24-5+1行ある
  for (let i = 0; i < 24 - 5 + 1; i++) {
    const row = lines[i].split(',');
    // 0列目は時, 1列目以降は分
    const prefix = row[0].trim().padStart(2, '0');
    for (let j = 1; j < row.length; j++) {
      const items = row[j].trim().split(/\s/);
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

const filenames = [
  'resources/from-kitaikoma-weekday.csv',
  'resources/from-kitaikoma-weekend.csv',
  'resources/to-kitaikoma-weekday.csv',
  'resources/to-kitaikoma-weekend.csv',
];

async function run()/*:Promise<void>*/ {
  for (const filename of filenames) {
    const data = await fs.readFile(filename)
    const content = data.toString();
    console.log(filename);
    console.log(parseCsv(content));
  }
}

run().then(() => { });
