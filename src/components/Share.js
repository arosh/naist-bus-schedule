import React from 'react';
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
  },
  facebook: {
    marginRight: '5px',
  },
  line: {
    marginRight: '5px',
  },
  logo: {
    width: 32,
    height: 32,
  }
};

const publicURL = encodeURIComponent(process.env.PUBLIC_URL);
// prettier-ignore
const twitterURL = `http://twitter.com/intent/tweet?url=${publicURL}&text=${document.title}`;
const facebookURL = `http://www.facebook.com/sharer.php?u=${publicURL}`;
const lineURL = `http://line.me/R/msg/text/?${publicURL}`;

export default () => (
  <div style={styles.container}>
    <div className="form-group">
      <a
        href={twitterURL}
        target="_blank"
        rel="noreferrer noopener"
        style={styles.twitter}
      >
        <img src={twitterLogo} alt="twitter logo" style={styles.logo} />
      </a>
      <a
        href={facebookURL}
        target="_blank"
        rel="noreferrer noopener"
        style={styles.facebook}
      >
        <img src={facebookLogo} alt="facebook logo" style={styles.logo} />
      </a>
      <a
        href={lineURL}
        target="_blank"
        rel="noreferrer noopener"
        style={styles.line}
      >
        <img src={lineLogo} alt="LINE logo" style={styles.logo} />
      </a>
    </div>
  </div>
);
