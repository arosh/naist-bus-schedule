import React from 'react';

const styles = {
  panel: {
    borderColor: '#424242',
  },
  center: {
    fontSize: '48px',
  },
};

export default () =>
  <div>
    <div className="panel" style={styles.panel}>
      <div className="panel-body">
        <div className="text-center" style={styles.center}>
          12:34:56
        </div>
      </div>
    </div>
  </div>;
