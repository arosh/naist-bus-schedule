type Props = {
  direction: string;
  busStop: string;
  scheduleType: string;
  onDirectionChange: (value: string) => void;
  onBusStopChange: (value: string) => void;
  onScheduleTypeChange: (value: string) => void;
};

function Form({
  direction,
  busStop,
  scheduleType,
  onDirectionChange,
  onBusStopChange,
  onScheduleTypeChange,
}: Props) {
  return (
  <form className="w-full">
    <div className="mb-4">
      <label
        className="block font-bold mb-1 sm:mb-0 sm:w-1/3 sm:inline-block sm:text-right sm:pr-4"
        htmlFor="direction"
      >
        <i className="fas fa-exchange-alt" aria-hidden="true" /> Direction
      </label>
      <div className="sm:w-2/3 sm:inline-block">
        <select
          id="direction"
          name="direction"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500"
          value={direction}
          onChange={(e) => {
            onDirectionChange(e.target.value);
          }}
        >
          <option value="to">NAIST行き / To NAIST</option>
          <option value="from">NAIST発 / From NAIST</option>
        </select>
      </div>
    </div>
    <div className="mb-4">
      <label
        className="block font-bold mb-1 sm:mb-0 sm:w-1/3 sm:inline-block sm:text-right sm:pr-4"
        htmlFor="busStop"
      >
        <i className="fas fa-bus" aria-hidden="true" /> Bus Stop
      </label>
      <div className="sm:w-2/3 sm:inline-block">
        <select
          id="busStop"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500"
          value={busStop}
          onChange={(e) => {
            onBusStopChange(e.target.value);
          }}
        >
          <option value="kitaikoma">
            学研北生駒駅 / Gakken Kita Ikoma Station
          </option>
          <option value="gakuemmae">学園前駅 / Gakuemmae Station</option>
          <option value="takanohara">高の原駅 / Takanohara Station</option>
          <option value="tomigaoka">登美ヶ丘駅 / Tomigaoka Station</option>
        </select>
      </div>
    </div>
    <div className="mb-4">
      <label
        className="block font-bold mb-1 sm:mb-0 sm:w-1/3 sm:inline-block sm:text-right sm:pr-4"
        htmlFor="scheduleType"
      >
        <i className="far fa-calendar-alt" aria-hidden="true" /> Timetable
      </label>
      <div className="sm:w-2/3 sm:inline-block">
        <select
          id="scheduleType"
          value={scheduleType}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500"
          onChange={(e) => {
            onScheduleTypeChange(e.target.value);
          }}
        >
          <option value="weekday">平日ダイヤ / weekday</option>
          <option value="weekend">休日ダイヤ / weekend</option>
        </select>
      </div>
    </div>
  </form>
  );
}

export default Form;
