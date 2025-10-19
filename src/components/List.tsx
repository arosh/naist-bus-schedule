type Props = {
  scheduleMap: { [key: string]: string[] };
};

function List({ scheduleMap }: Props) {
  const keys = Object.keys(scheduleMap);
  keys.sort();
  return (
    <div className="time-table-js">
      <h2 className="mb-2 text-xl font-bold">
        <i className="far fa-clock" aria-hidden="true" /> 時刻表
      </h2>
      <div className="space-y-3">
        {keys.map((key) => (
          <div
            key={key}
            className="overflow-hidden rounded border border-gray-300"
          >
            <div className="bg-gray-800 px-3 py-1 text-sm font-medium text-gray-100">
              {key}
            </div>
            <div className="p-3">
              <ul className="flex flex-wrap gap-3">
                {scheduleMap[key].map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1 font-medium shadow transition-colors hover:bg-gray-100"
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
}

export default List;
