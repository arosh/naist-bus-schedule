// @flow
import React from 'react';
import { Container } from 'flux/utils';
import Store from '../flux/Store';
import SplitScheduleService from '../services/SplitScheduleService';

const styles = {
  panelPrimary: {
    borderColor: '#424242',
  },
  panelHeading: {
    backgroundColor: '#212121',
    borderColor: '#424242',
  },
};

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
    const map = SplitScheduleService.split(this.state.schedule);
    const keys = Object.keys(map);
    keys.sort();
    return (
      <div>
        <h2><i className="fa fa-clock-o" aria-hidden="true" /> Schedule</h2>
        {keys.map(key => (
          <div
            key={key}
            className="panel panel-primary"
            style={styles.panelPrimary}
          >
            <div className="panel-heading" style={styles.panelHeading}>
              {key}
            </div>
            <ul className="list-group">
              {map[key].map(item => (
                <li key={item} className="list-group-item">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

export default Container.create(List);
