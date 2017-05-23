// @flow
import React from 'react';
import { Container } from 'flux/utils';
import Store from '../flux/Store';

class List extends React.Component {
  state: {
    schedule: string[],
  };

  static getStores() {
    return [Store];
  }

  static calculateState() {
    return {
      schedule: Store.getState().schedule,
    };
  }

  render() {
    return (
      <div>
        <h2><i className="fa fa-clock-o" aria-hidden="true" /> Schedule</h2>
        <ul className="list-group">
          {this.state.schedule.map(item => (
            <li key={item} className="list-group-item">{item}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Container.create(List);
