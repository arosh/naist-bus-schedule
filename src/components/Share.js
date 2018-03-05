import React from 'react';

// https://stackoverflow.com/questions/20626685/better-way-to-set-distance-between-flexbox-items
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: '-5px',
  },
  twitter: {
    color: '#fff',
    backgroundColor: '#55acee',
    marginRight: '5px',
  },
  facebook: {
    color: '#fff',
    backgroundColor: '#2d4373',
    marginRight: '5px',
  },
  line: {
    color: '#fff',
    backgroundColor: '#00b900',
    marginRight: '5px',
  },
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
        className="btn"
        style={styles.twitter}
      >
        <i className="fab fa-twitter fa-lg" /> ツイート
      </a>
      <a
        href={facebookURL}
        target="_blank"
        rel="noreferrer noopener"
        className="btn"
        style={styles.facebook}
      >
        <i className="fab fa-facebook fa-lg" /> シェア
      </a>
      <a
        href={lineURL}
        target="_blank"
        rel="noreferrer noopener"
        className="btn"
        style={styles.line}
      >
        <i className="fab fa-line fa-lg" /> LINEで送る
      </a>
    </div>
  </div>
);
