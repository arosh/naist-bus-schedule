import * as React from 'react';
import { connect } from 'react-redux';
import TimeDiffService from '../services/TimeDiffService';

const styles = {
  panel: {
    borderColor: '#424242',
  },
  center: {
    fontSize: '48px',
  },
};

const pad = (value: string) => value.toString(10).padStart(2, '0');

const Next = ({ exist, hour, minute, second }) =>
  exist && (
    <React.Fragment>
      <h2>次発バスまでの時間</h2>
      <div className="panel" style={styles.panel}>
        <div className="panel-body">
          <div className="text-center" style={styles.center}>
            {`${pad(hour)}：${pad(minute)}：${pad(second)}`}
          </div>
        </div>
      </div>
    </React.Fragment>
  );

export default connect(state => {
  const diff = TimeDiffService.getNext(
    state.hour,
    state.minute,
    state.second,
    state.schedule
  );
  if (diff.hour !== -1) {
    return {
      exist: true,
      hour: diff.hour,
      minute: diff.minute,
      second: diff.second,
    };
  }
  return {
    exist: false,
  };
})(Next);
