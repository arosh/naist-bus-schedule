// @flow
import React from 'react';

const styles = {
  siteFooter: {
    margin: '28px 0 40px',
    textAlign: 'center',
  },
};

export default () => (
  <div style={styles.siteFooter}>
    <p>Last modified: 2017/10/03</p>
    <p>
      Icons made by{' '}
      <a href="http://www.freepik.com" title="Freepik">
        Freepik
      </a>{' '}
      from{' '}
      <a href="http://www.flaticon.com" title="Flaticon">
        www.flaticon.com
      </a>{' '}
      is licensed by{' '}
      <a
        href="http://creativecommons.org/licenses/by/3.0/"
        title="Creative Commons BY 3.0"
        target="_blank"
        rel="noopener noreferrer"
      >
        CC 3.0 BY
      </a>
    </p>
  </div>
);
