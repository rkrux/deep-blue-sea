import { useEffect, useRef, useState } from 'react';

// Content should not have a div or a ref
function Content({ scrollView, style }) {
  const divRef = useRef(null);
  useEffect(() => divRef.current.scrollIntoView(false), []);
  useEffect(
    () => divRef.current.scrollIntoView(scrollView === 'top'),
    [scrollView]
  );

  return (
    <div ref={divRef}>
      {Array.from({ length: 20 }, (_, i) => i).map((_, index) => {
        return (
          <div
            style={{
              border: '1px solid red',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              height: `${style.height}`,
              width: `${style.width}`,
            }}
            key={index + 1}
          >{`Card number ${index + 1}`}</div>
        );
      })}
    </div>
  );
}

function ScrollableCard({ scrollView, style }) {
  return (
    <div style={{ overflow: 'auto', ...style }}>
      <Content
        scrollView={scrollView}
        style={{ height: '30px', width: '100px' }}
      />
    </div>
  );
}

function Solb() {
  const [scrollView, setScrollView] = useState('bottom');
  return (
    <>
      <button onClick={() => setScrollView('top')}>Scroll to top</button>
      <ScrollableCard
        scrollView={scrollView}
        style={{ height: '300px', width: '200px' }}
      />
      <button onClick={() => setScrollView('bottom')}>Scroll to bottom</button>
    </>
  );
}

export default Solb;
