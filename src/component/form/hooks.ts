import React from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth,
  });

  const onResize = React.useCallback(() => {
    setWindowSize({
      height: document.documentElement.clientHeight,
      width: document.documentElement.clientWidth,
    });
  }, []);

  React.useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return windowSize;
}
