import { useMemo } from 'react';
import twitterLogo from '../assets/brands/Twitter_Social_Icon_Square_Color.svg';
import facebookLogo from '../assets/brands/FB-f-Logo__blue_100.png';
import lineLogo from '../assets/brands/LINE_SOCIAL_Square_typeA.png';

function Share() {
  const { twitterURL, facebookURL, lineURL } = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        twitterURL: '',
        facebookURL: '',
        lineURL: '',
      };
    }

    const href = window.location.href;
    const encodedUrl = encodeURIComponent(href);
    const title =
      typeof document !== 'undefined' && document.title
        ? encodeURIComponent(document.title)
        : '';

    return {
      twitterURL: `http://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`,
      facebookURL: `http://www.facebook.com/sharer.php?u=${encodedUrl}`,
      lineURL: `http://line.me/R/msg/text/?${encodedUrl}`,
    };
  }, []);

  return (
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
}

export default Share;
