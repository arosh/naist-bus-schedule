import React from 'react';

const btnTwitterStyle = {
  color: '#fff',
  backgroundColor: '#55acee',
  borderColor: '#4ca7ed',
  marginRight: '5px',
};

const btnFacebookStyle = {
  color: '#fff',
  backgroundColor: '#2d4373',
  borderColor: '#273b65',
};

const url = () =>
  encodeURIComponent('https://arosh.github.io/naist-bus-schedule/');
const tweetUrl = () =>
  `http://twitter.com/intent/tweet?url=${url()}&text=${document.title}`;
const facebookUrl = () => `http://www.facebook.com/sharer.php?u=${url()}`;

export default () => (
  <div className="clearfix">
    <div className="pull-right">
      <div className="form-group">
        <a
          href={tweetUrl()}
          target="_blank"
          rel="noreferrer noopener"
          className="btn"
          style={btnTwitterStyle}
        >
          <i className="fa fa-twitter fa-lg" /> ツイート
        </a>
        <a
          href={facebookUrl()}
          target="_blank"
          rel="noreferrer noopener"
          className="btn"
          style={btnFacebookStyle}
        >
          <i className="fa fa-facebook fa-lg" /> シェア
        </a>
      </div>
    </div>
  </div>
);
