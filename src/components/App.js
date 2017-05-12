// @flow

import React from 'react';
import Form from './Form';

export default class App extends React.Component {
  state: {
    direction: string,
    busStop: string,
    timetable: string,
  };
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
