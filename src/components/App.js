// @flow

import React from 'react';
import Form from './Form';
import List from './List';
import BusScheduleService from '../services/BusScheduleService';

export default class App extends React.Component {
  props: {
    busScheduleService: BusScheduleService,
  };
  state: {
    direction: string,
    busStop: string,
    timetable: string,
    schedule: string[],
  };
  constructor(props?: any) {
    super(props);
    this.state = {
      direction: 'from',
      busStop: 'kitaikoma',
      timetable: 'weekday',
      schedule: [],
    };
    this.updateSchedule();
  }
  updateSchedule = async () => {
    const query = `${this.state.direction}-${this.state.busStop}-${this.state.timetable}`;
    const schedule = await this.props.busScheduleService.fetch(query);
    this.setState({
      schedule,
    });
  };
  onChange = (name: string, value: string) => {
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.updateSchedule();
      }
    );
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
      <List schedule={this.state.schedule} />
    </div>
  );
}
