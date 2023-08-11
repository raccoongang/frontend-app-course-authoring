import { useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useScrollToHashElement = () => {
  const currentURL = window.location.href;
  const elementID = currentURL.split('#')[1];
  const element = document.getElementById(elementID);

  useEffect(() => {
    if (element) {
      element.scrollIntoView();
      // eslint-disable-next-line no-restricted-globals
      history.replaceState({}, document.title, window.location.href.split('#')[0]);
    }
  }, [element]);
};
