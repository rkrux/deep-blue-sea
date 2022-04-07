import { useEffect, useRef, useState } from 'react';
import VanillaTilt from 'vanilla-tilt';

function Two() {
  const divRef = useRef(null);
  const [tiltData, setTiltData] = useState();

  useEffect(() => {
    const node = divRef.current;
    VanillaTilt.init(node, { max: 50, speed: 200, scale: 1 });
    const listener = (event) => {
      setTiltData(event.detail);
    };

    node.addEventListener('tiltChange', listener);
    return () => {
      node.vanillaTilt.destroy();
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '50px',
      }}
    >
      <div
        ref={divRef}
        style={{
          height: '400px',
          width: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px dashed rgba(0, 0, 0, 255)',
          borderRadius: '5px',
          fontSize: '10px',
        }}
      >
        {!tiltData && <>Point here</>}
        {tiltData && (
          <div>
            Angle: {tiltData.angle.toFixed(2)}
            <br />
            PercentX: {tiltData.percentageX.toFixed(2)}
            <br />
            PercentY: {tiltData.percentageY.toFixed(2)}
            <br />
            TiltX: {tiltData.tiltX}
            <br />
            TiltY: {tiltData.tiltY}
          </div>
        )}
      </div>
    </div>
  );
}

export default Two;
