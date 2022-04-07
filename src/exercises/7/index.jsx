import { useDebugValue, useEffect, useState } from 'react';

const getScreenType = (width) =>
  width > 1000 ? 'Large' : width > 700 ? 'Medium' : 'Small';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const [screenType, setScreenType] = useState(getScreenType(windowSize.width));

  const resizeListener = (event) => {
    setWindowSize({
      height: event.target.innerHeight,
      width: event.target.innerWidth,
    });
    setScreenType(getScreenType(event.target.innerWidth));
  };

  useEffect(() => {
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  useDebugValue(`ScreenType: ${screenType}`);
  return { windowSize, screenType };
}

function Seven() {
  const { windowSize, screenType } = useWindowSize();

  return (
    <>
      <p>
        {windowSize.height} / {windowSize.width}
      </p>
      <p>{screenType}</p>
    </>
  );
}

export default Seven;
