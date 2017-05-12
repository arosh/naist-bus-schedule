// @flow

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      direction: 'to',
      busStop: 'kitaikoma',
      timetable: 'weekday',
    };
  }
  onChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };
  render = () => (
    <div className="container">
      <h1>NAIST Bus Schedule</h1>
      <form className="form-horizontal">
        <div className="form-group">
          <label className="col-sm-2 control-label">Direction</label>
          <div className="col-sm-10">
            <select
              className="form-control"
              value={this.state.direction}
              onChange={e => {
                this.onChange('direction', e.target.value);
              }}
            >
              <option value="to">To NAIST</option>
              <option value="from">From NAIST</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">Bus Stop</label>
          <div className="col-sm-10">
            <select
              className="form-control"
              onChange={e => {
                this.onChange('direction', e.target.value);
              }}
            >
              <option value="kitaikoma">学研北生駒駅</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">Timetable</label>
          <div className="col-sm-10">
            <select
              className="form-control"
              onChange={e => {
                this.onChange('timetable', e.target.value);
              }}
            >
              <option value="weekday">for weekday</option>
              <option value="weekend">for weekend</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('react-root'));
