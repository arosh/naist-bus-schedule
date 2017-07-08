// @flow
import React from 'react';
import { Container } from 'flux/utils';
import Store from '../flux/Store';

const styles = {
  panel: {
    borderColor: '#424242',
  },
  panelHeading: {
    color: '#fff',
    backgroundColor: '#212121',
    borderColor: '#424242',
  },
};

class List extends React.Component {
  state: {
    scheduleMap: { [hour: string]: string[] },
  };

  static getStores() {
    return [Store];
  }

  static calculateState() {
    return {
      scheduleMap: Store.getState().scheduleMap,
    };
  }

  render() {
    const keys = Object.keys(this.state.scheduleMap);
    keys.sort();
    return (
      <div>
        <h2>
          <i className="fa fa-clock-o" aria-hidden="true" /> Schedule
        </h2>
        {keys.map(key =>
          <div
            key={key}
            className="panel"
            style={styles.panel}
          >
            <div className="panel-heading" style={styles.panelHeading}>
              {key}
            </div>
            <ul className="list-group">
              {this.state.scheduleMap[key].map(item =>
                <li key={item} className="list-group-item">
                  {item}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Container.create(List);
