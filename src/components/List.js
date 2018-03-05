// @flow
import React from 'react';

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

export default ({ scheduleMap }) => {
  const keys = Object.keys(scheduleMap);
  keys.sort();
  return (
    <div className="schedule-list">
      <h2>
        <i className="far fa-clock" aria-hidden="true" /> 時刻表
      </h2>
      {keys.map(key => (
        <div key={key} className="panel" style={styles.panel}>
          <div className="panel-heading" style={styles.panelHeading}>
            {key}
          </div>
          <ul className="list-group">
            {scheduleMap[key].map(item => (
              <li key={item} className="list-group-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
