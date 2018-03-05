// @flow
import * as React from 'react';

const styles = {
  panel: {
    borderColor: '#424242',
  },
  center: {
    fontSize: '48px',
  },
};

const pad = (value: number) => value.toString().padStart(2, '0');

type Props = {
  exist: boolean,
  hour: number,
  minute: number,
  second: number,
};

export default ({ exist, hour, minute, second }: Props) =>
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
