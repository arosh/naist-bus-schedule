import React from 'react';

export default (props: { schedule: string[] }) => (
  <div>
    <h2><span className="glyphicon glyphicon-time" /> Schedule</h2>
    <ul className="list-group">
      {props.schedule.map(item => (
        <li key={item} className="list-group-item">{item}</li>
      ))}
    </ul>
  </div>
);
