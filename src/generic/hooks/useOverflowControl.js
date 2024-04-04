import { useEffect } from 'react';

const useOverflowControl = (targetSelector) => {
  useEffect(() => {
    const handleOverflow = () => {
      const body = document.querySelector('body');
      const targetElement = document.querySelector(targetSelector);

      if (targetElement) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = 'auto';
      }
    };

    handleOverflow();

    const observer = new MutationObserver(handleOverflow);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [targetSelector]);
};

export default useOverflowControl;
