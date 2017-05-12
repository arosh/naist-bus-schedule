// @flow

import React from 'react';
import ReactDOM from 'react-dom';

const Form = (props: {
  direction: string,
  busStop: string,
  timetable: string,
  onChange: (string, string) => void,
}) => (
  <form className="form-horizontal">
    <div className="form-group">
      <label className="col-xs-3 control-label">Direction</label>
      <div className="col-xs-9">
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
      <label className="col-xs-3 control-label">Bus Stop</label>
      <div className="col-xs-9">
        <select
          className="form-control"
          value={props.busStop}
          onChange={e => {
            props.onChange('busStop', e.target.value);
          }}
        >
          <option value="kitaikoma">Gakken Kita Ikoma</option>
          <option value="takanohara">Takanohara</option>
        </select>
      </div>
    </div>
    <div className="form-group">
      <label className="col-xs-3 control-label">Timetable</label>
      <div className="col-xs-9">
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
      <Form
        direction={this.state.direction}
        busStop={this.state.busStop}
        timetable={this.state.timetable}
        onChange={this.onChange}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('react-root'));
