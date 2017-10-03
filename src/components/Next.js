import React from 'react';
import { connect } from 'react-redux';
import * as padStart from 'string.prototype.padstart';
import TimeDiffService from '../services/TimeDiffService';

const styles = {
  panel: {
    borderColor: '#424242',
  },
  center: {
    fontSize: '48px',
  },
};

const Next = ({ exist, hour, minute, second }) => (
  <div>
    {exist && (
      <div>
        <h2>次発バスまでの時間</h2>
        <div className="panel" style={styles.panel}>
          <div className="panel-body">
            <div className="text-center" style={styles.center}>
              {padStart(hour, 2, '0')}：{padStart(minute, 2, '0')}：{padStart(second, 2, '0')}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
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
  } else {
    return {
      exist: false,
    };
  }
})(Next);
