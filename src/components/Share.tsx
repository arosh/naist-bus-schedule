import * as React from 'react';
import twitterLogo from '../assets/brands/Twitter_Social_Icon_Square_Color.svg';
import facebookLogo from '../assets/brands/FB-f-Logo__blue_100.png';
import lineLogo from '../assets/brands/LINE_SOCIAL_Square_typeA.png';

const publicURL = encodeURIComponent(window.location.href);
// prettier-ignore
const twitterURL = `http://twitter.com/intent/tweet?url=${publicURL}&text=${document.title}`;
const facebookURL = `http://www.facebook.com/sharer.php?u=${publicURL}`;
const lineURL = `http://line.me/R/msg/text/?${publicURL}`;

export default () => (
  <div className="mb-4">
    <div className="flex flex-row justify-end gap-2">
      <a href={twitterURL} target="_blank" rel="noreferrer noopener">
        <img src={twitterLogo} alt="Twitter logo" className="w-10 h-10" />
      </a>
      <a href={facebookURL} target="_blank" rel="noreferrer noopener">
        <img
          src={facebookLogo}
          alt="Facebook logo"
          className="w-10 h-10 bg-[#3b5998]"
        />
      </a>
      <a href={lineURL} target="_blank" rel="noreferrer noopener">
        <img src={lineLogo} alt="LINE logo" className="w-10 h-10" />
      </a>
    </div>
  </div>
);
