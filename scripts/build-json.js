// @flow

const fs = require('fs');
const padStart = require('string.prototype.padstart');
padStart.shim();

function parseCsv(content /*: string*/) /*: string[]*/ {
  const retval = [];
  const lines = content.split('\n');
  for (let i = 0; i < 24 - 5 + 1; i++) {
    const row = lines[i].split(',');
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

let promise = Promise.resolve();

for (const filename of filenames) {
  promise = promise.then(
    () =>
      new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
          if (err) {
            reject(err);
          }
          const content = data.toString();
          console.log(filename);
          console.log(parseCsv(content));
          resolve();
        });
      })
  );
}
