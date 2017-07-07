// @flow
import React from 'react';
import Form from './Form';
import List from './List';
import Footer from './Footer';
import Share from './Share';
import HolidayService from '../services/HolidayService';
import * as UseCase from '../flux/UseCase';

// const Text = ({children}) => <span style={{display: 'inline-block'}}>{children}</span>;

export default class App extends React.Component {
  state: {
    direction: string,
    busStop: string,
    timetable: string,
  };
  constructor(props?: any) {
    super(props);
    const timetable =
      HolidayService.isTodayHoliday() || HolidayService.isTodayWeekend()
        ? 'weekend'
        : 'weekday';
    this.state = {
      // 初めてアプリを触る人はNAIST行きの時刻を知りたいはず
      direction: 'to',
      busStop: 'kitaikoma',
      timetable,
    };
    this.updateSchedule();
  }
  updateSchedule = () => {
    // フォームのfrom, toとresourcesのfrom, toを間違えやすいので注意
    const direction = this.state.direction === 'from' ? 'to' : 'from';
    const query = `${direction}-${this.state.busStop}-${this.state.timetable}`;
    UseCase.updateSchedule(query);
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
  render = () =>
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-md-offset-2 col-md-8">
          <h1>
            {document.title}
          </h1>
          <Share />
          <Form
            direction={this.state.direction}
            busStop={this.state.busStop}
            timetable={this.state.timetable}
            onChange={this.onChange}
          />
          <List />
          <Footer />
        </div>
      </div>
    </div>;
}
