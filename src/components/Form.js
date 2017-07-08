// @flow
import React from 'react';

export default (props: {
  direction: string,
  busStop: string,
  timeTable: string,
  onChange: (string, string) => void,
}) =>
  <form className="form-horizontal">
    <div className="form-group">
      <label className="col-sm-2 control-label">
        {/* glyphicon-transferと迷う… */}
        <i className="fa fa-exchange" aria-hidden="true" /> Direction
      </label>
      <div className="col-sm-10">
        <select
          name="direction"
          className="form-control"
          value={props.direction}
          onChange={e => {
            props.onChange('direction', e.target.value);
          }}
        >
          <option value="to">To NAIST</option>
          <option value="from">From NAIST</option>
        </select>
      </div>
    </div>
    <div className="form-group">
      <label className="col-sm-2 control-label">
        <i className="fa fa-bus" aria-hidden="true" /> Bus Stop
      </label>
      <div className="col-sm-10">
        <select
          name="busStop"
          className="form-control"
          value={props.busStop}
          onChange={e => {
            props.onChange('busStop', e.target.value);
          }}
        >
          <option value="kitaikoma">学研北生駒駅 / Gakken Kita Ikoma Station</option>
          <option value="gakuemmae">学園前駅 / Gakuemmae Station</option>
          <option value="takanohara">高の原駅 / Takanohara Station</option>
        </select>
      </div>
    </div>
    <div className="form-group">
      <label className="col-sm-2 control-label">
        <i className="fa fa-calendar" aria-hidden="true" /> Timetable
      </label>
      <div className="col-sm-10">
        <select
          name="timeTable"
          value={props.timeTable}
          className="form-control"
          onChange={e => {
            props.onChange('timeTable', e.target.value);
          }}
        >
          <option value="weekday">for weekday</option>
          <option value="weekend">for weekend</option>
        </select>
      </div>
    </div>
  </form>;
