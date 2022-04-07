import {
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
} from 'react';

// Content should not have a div or a ref
function Content({ style }, ref) {
  return (
    <div ref={ref}>
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
const ContentWrapper = forwardRef(Content);

function ScrollableCard({ style }, ref) {
  const contentRef = useRef(null);
  useEffect(() => contentRef.current.scrollIntoView(false), []);

  useImperativeHandle(ref, () => {
    return {
      scrollToTop: () => {
        contentRef.current.scrollIntoView(true);
      },
      scrollToBottom: () => {
        contentRef.current.scrollIntoView(false);
      },
    };
  });

  return (
    <div style={{ overflow: 'auto', ...style }}>
      <ContentWrapper
        ref={contentRef}
        style={{ height: '30px', width: '100px' }}
      />
    </div>
  );
}
const ScrollableCardWrapper = forwardRef(ScrollableCard);

function Sola() {
  const ref = useRef(null);
  return (
    <>
      <button
        onClick={() => {
          ref.current.scrollToTop();
        }}
      >
        Scroll to top
      </button>
      <ScrollableCardWrapper
        ref={ref}
        style={{ height: '300px', width: '200px' }}
      />
      <button
        onClick={() => {
          ref.current.scrollToBottom();
        }}
      >
        Scroll to bottom
      </button>
    </>
  );
}

export default Sola;
