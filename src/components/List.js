// @flow
import React from 'react';

export default (props: { schedule: string[] }) => (
  <div>
    <h2><i className="fa fa-clock-o" aria-hidden="true" /> Schedule</h2>
    <ul className="list-group">
      {props.schedule.map(item => (
        <li key={item} className="list-group-item">{item}</li>
      ))}
    </ul>
  </div>
);
