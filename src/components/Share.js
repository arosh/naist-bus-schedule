// @flow
import * as React from 'react';
import twitterLogo from '../assets/brands/Twitter_Social_Icon_Square_Color.svg';
import facebookLogo from '../assets/brands/FB-f-Logo__blue_100.png';
import lineLogo from '../assets/brands/LINE_SOCIAL_Square_typeA.png';

// https://stackoverflow.com/questions/20626685/better-way-to-set-distance-between-flexbox-items
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: '-5px',
  },
  twitter: {
    marginRight: '5px',
    width: 48,
    height: 48,
  },
  facebook: {
    marginRight: '5px',
    width: 48,
    height: 48,
    backgroundColor: '#3b5998',
  },
  line: {
    marginRight: '5px',
    width: 48,
    height: 48,
  },
};

const publicURL = encodeURIComponent(window.location.href);
// prettier-ignore
const twitterURL = `http://twitter.com/intent/tweet?url=${publicURL}&text=${document.title}`;
const facebookURL = `http://www.facebook.com/sharer.php?u=${publicURL}`;
const lineURL = `http://line.me/R/msg/text/?${publicURL}`;

export default () => (
  <div style={styles.container}>
    <div className="form-group">
      <a href={twitterURL} target="_blank" rel="noreferrer noopener">
        <img src={twitterLogo} alt="twitter logo" style={styles.twitter} />
      </a>
      <a href={facebookURL} target="_blank" rel="noreferrer noopener">
        <img src={facebookLogo} alt="facebook logo" style={styles.facebook} />
      </a>
      <a href={lineURL} target="_blank" rel="noreferrer noopener">
        <img src={lineLogo} alt="LINE logo" style={styles.line} />
      </a>
    </div>
  </div>
);
