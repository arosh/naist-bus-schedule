// @flow

import React from 'react';

export default (props: {
  direction: string,
  busStop: string,
  timetable: string,
  onChange: (string, string) => void,
}) => (
  <form className="form-horizontal">
    <div className="form-group">
      <label className="col-sm-2 control-label">
        {/* glyphicon-transferと迷う… */}
        <span className="glyphicon glyphicon-sort" /> Direction
      </label>
      <div className="col-sm-10">
        <select
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
          className="form-control"
          value={props.busStop}
          onChange={e => {
            props.onChange('busStop', e.target.value);
          }}
        >
          <option value="kitaikoma">Gakken Kita Ikoma</option>
          <option value="gakuemmae">Gakuemmae</option>
          <option value="takanohara">Takanohara</option>
        </select>
      </div>
    </div>
    <div className="form-group">
      <label className="col-sm-2 control-label">
        <span className="glyphicon glyphicon-calendar" /> Timetable
      </label>
      <div className="col-sm-10">
        <select
          value={props.timetable}
          className="form-control"
          onChange={e => {
            props.onChange('timetable', e.target.value);
          }}
        >
          <option value="weekday">for weekday</option>
          <option value="weekend">for weekend</option>
        </select>
      </div>
    </div>
  </form>
);
