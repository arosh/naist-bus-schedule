// @flow
import React from 'react';
import { connect } from 'react-redux';
import * as UseCase from '../flux/UseCase';

const Form = ({ direction, busStop, timeTable, onChange }) => (
  <form className="form-horizontal">
    <div className="form-group">
      <label className="col-sm-2 col-md-3 control-label">
        <i className="fa fa-exchange" aria-hidden="true" /> Direction
      </label>
      <div className="col-sm-10 col-md-9">
        <select
          name="direction"
          className="form-control"
          value={direction}
          onChange={e => {
            onChange('direction', e.target.value);
          }}
        >
          <option value="to">NAIST行き / To NAIST</option>
          <option value="from">NAIST発 / From NAIST</option>
        </select>
      </div>
    </div>
    <div className="form-group">
      <label className="col-sm-2 col-md-3 control-label">
        <i className="fa fa-bus" aria-hidden="true" /> Bus Stop
      </label>
      <div className="col-sm-10 col-md-9">
        <select
          name="busStop"
          className="form-control"
          value={busStop}
          onChange={e => {
            onChange('busStop', e.target.value);
          }}
        >
          <option value="kitaikoma">
            学研北生駒駅 / Gakken Kita Ikoma Station
          </option>
          <option value="gakuemmae">学園前駅 / Gakuemmae Station</option>
          <option value="takanohara">高の原駅 / Takanohara Station</option>
        </select>
      </div>
    </div>
    <div className="form-group">
      <label className="col-sm-2 col-md-3 control-label">
        <i className="fa fa-calendar" aria-hidden="true" /> Timetable
      </label>
      <div className="col-sm-10 col-md-9">
        <select
          name="timeTable"
          value={timeTable}
          className="form-control"
          onChange={e => {
            onChange('timeTable', e.target.value);
          }}
        >
          <option value="weekday">平日ダイヤ / weekday</option>
          <option value="weekend">休日ダイヤ / weekend</option>
        </select>
      </div>
    </div>
  </form>
);

export default connect(
  state => ({
    direction: state.form.direction,
    busStop: state.form.busStop,
    timeTable: state.form.timeTable,
  }),
  () => ({
    onChange: (name, value) => {
      UseCase.changeForm(name, value);
    },
  })
)(Form);
