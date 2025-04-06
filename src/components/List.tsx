import * as React from 'react';

type Props = {
  scheduleMap: { [key: string]: string[] };
};

export default ({ scheduleMap }: Props) => {
  const keys = Object.keys(scheduleMap);
  keys.sort();
  return (
    <div className="time-table-js">
      <h2 className="text-xl font-bold mb-2">
        <i className="far fa-clock" aria-hidden="true" /> 時刻表
      </h2>
      <div className="space-y-3">
        {keys.map((key) => (
          <div
            key={key}
            className="border border-gray-300 rounded overflow-hidden"
          >
            <div className="bg-gray-800 text-gray-100 text-sm px-3 py-1 font-medium">
              {key}
            </div>
            <div className="p-3">
              <ul className="flex flex-wrap gap-2 list-none">
                {scheduleMap[key].map((item) => (
                  <li
                    key={item}
                    className="inline-block bg-white px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors shadow font-medium"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
