// @flow

import React from 'react';
import Form from './Form';
import List from './List';
import BusScheduleService from '../services/BusScheduleService';
import HolidayService from '../services/HolidayService';

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
    const holidayService = new HolidayService();
    const timetable = holidayService.isTodayHoliday() ||
      holidayService.isTodayWeekend()
      ? 'weekend'
      : 'weekday';
    this.state = {
      // 初めてアプリを触る人はNAIST行きの時刻を知りたいはず
      direction: 'to',
      busStop: 'kitaikoma',
      timetable,
      schedule: [],
    };
    this.updateSchedule();
  }
  updateSchedule = async () => {
    const direction = (this.state.direction === 'from' ? 'to' : 'from');
    const query = `${direction}-${this.state.busStop}-${this.state.timetable}`;
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
