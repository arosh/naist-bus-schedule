// @flow
import * as React from 'react';

type Props = {
  direction: string,
  busStop: string,
  scheduleType: string,
  onDirectionChange: (string) => void,
  onBusStopChange: (string) => void,
  onScheduleTypeChange: (string) => void,
};

export default ({
  direction,
  busStop,
  scheduleType,
  onDirectionChange,
  onBusStopChange,
  onScheduleTypeChange,
}: Props) => (
  <form className="form-horizontal">
    <div className="form-group">
      <label className="col-sm-2 col-md-3 control-label" htmlFor="direction">
        <i className="fas fa-exchange-alt" aria-hidden="true" /> Direction
      </label>
      <div className="col-sm-10 col-md-9">
        <select
          id="direction"
          name="direction"
          className="form-control"
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
    <div className="form-group">
      <label className="col-sm-2 col-md-3 control-label" htmlFor="busStop">
        <i className="fas fa-bus" aria-hidden="true" /> Bus Stop
      </label>
      <div className="col-sm-10 col-md-9">
        <select
          id="busStop"
          className="form-control"
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
    <div className="form-group">
      <label className="col-sm-2 col-md-3 control-label" htmlFor="scheduleType">
        <i className="far fa-calendar-alt" aria-hidden="true" /> Timetable
      </label>
      <div className="col-sm-10 col-md-9">
        <select
          id="scheduleType"
          value={scheduleType}
          className="form-control"
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
