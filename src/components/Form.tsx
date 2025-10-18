import type {
  DirectionValue,
  BusStopValue,
  ScheduleTypeValue,
} from '../stores';

type Props = {
  direction: DirectionValue;
  busStop: BusStopValue;
  scheduleType: ScheduleTypeValue;
  onDirectionChange: (value: DirectionValue) => void;
  onBusStopChange: (value: BusStopValue) => void;
  onScheduleTypeChange: (value: ScheduleTypeValue) => void;
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
          className="mb-1 block font-bold sm:mb-0 sm:inline-block sm:w-1/3 sm:pr-4 sm:text-right"
          htmlFor="direction"
        >
          <i className="fas fa-exchange-alt" aria-hidden="true" /> Direction
        </label>
        <div className="sm:inline-block sm:w-2/3">
          <select
            id="direction"
            name="direction"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none"
            value={direction}
            onChange={(e) => {
              onDirectionChange(e.target.value as DirectionValue);
            }}
          >
            <option value="to">NAIST行き / To NAIST</option>
            <option value="from">NAIST発 / From NAIST</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label
          className="mb-1 block font-bold sm:mb-0 sm:inline-block sm:w-1/3 sm:pr-4 sm:text-right"
          htmlFor="busStop"
        >
          <i className="fas fa-bus" aria-hidden="true" /> Bus Stop
        </label>
        <div className="sm:inline-block sm:w-2/3">
          <select
            id="busStop"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none"
            value={busStop}
            onChange={(e) => {
              onBusStopChange(e.target.value as BusStopValue);
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
          className="mb-1 block font-bold sm:mb-0 sm:inline-block sm:w-1/3 sm:pr-4 sm:text-right"
          htmlFor="scheduleType"
        >
          <i className="far fa-calendar-alt" aria-hidden="true" /> Timetable
        </label>
        <div className="sm:inline-block sm:w-2/3">
          <select
            id="scheduleType"
            value={scheduleType}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none"
            onChange={(e) => {
              onScheduleTypeChange(e.target.value as ScheduleTypeValue);
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
