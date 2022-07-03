import { faker } from '@faker-js/faker';
import { useEffect, useRef, useState } from 'react';
const allData = Array(10 * 1000)
  .fill(undefined)
  .map((_, index) => ({
    id: index,
    name: faker.name.findName(),
    score: `${faker.random.numeric(2)}%`,
  }));

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '0px',
  threshold: 0,
};

const TIME_MS = 1500;

function useIntersectionObserver(
  elementRef,
  deps,
  topOrBottom = 'bottom',
  callbackFn
) {
  useEffect(() => {
    if (!elementRef.current) {
      console.error(
        `Invalid element passed to useIntersectionObserver: ${elementRef.current}`
      );
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(callbackFn);
    }, OBSERVER_OPTIONS);

    observer.observe(
      topOrBottom === 'bottom'
        ? elementRef.current.lastElementChild
        : elementRef.current.firstElementChild
    );
    return () => observer.disconnect();
  }, deps);
}

const VirtualList = ({ boxHeight, elementHeight, bufferElementsCount }) => {
  const displayedElementsCount = boxHeight / elementHeight;
  const [list, setList] = useState(
    allData.slice(
      0,
      bufferElementsCount + displayedElementsCount + bufferElementsCount
    )
  );
  const cursorRef = useRef({
    start: 0,
    end: bufferElementsCount + displayedElementsCount + bufferElementsCount,
    topOrBottom: 'bottom',
  });
  const listRef = useRef(null);

  useIntersectionObserver(listRef, [list], 'bottom', (entry) => {
    if (entry.isIntersecting) {
      const newListStart = Math.max(
        0,
        cursorRef.current.end - bufferElementsCount
      );
      const newListEnd =
        cursorRef.current.end + displayedElementsCount + bufferElementsCount;
      const newList = allData.slice(newListStart, newListEnd);
      if (newList.length === 0) {
        return;
      }

      setTimeout(() => {
        setList(newList);
        cursorRef.current = {
          start: newListStart,
          end: newListEnd,
          topOrBottom: 'bottom',
        };
      }, TIME_MS);
    }
  });

  useIntersectionObserver(listRef, [list], 'top', (entry) => {
    if (entry.isIntersecting) {
      const newListStart =
        cursorRef.current.start - displayedElementsCount - bufferElementsCount;
      const newListEnd = Math.min(
        cursorRef.current.start + bufferElementsCount,
        allData.length
      );
      const newList = allData.slice(newListStart, newListEnd);
      if (newList.length === 0) {
        return;
      }

      setTimeout(() => {
        setList(newList);
        cursorRef.current = {
          start: newListStart,
          end: newListEnd,
          topOrBottom: 'top',
        };
      }, TIME_MS);
    }
  });

  useEffect(() => {
    console.log('cursorRef: ', cursorRef.current);
    if (cursorRef.current.topOrBottom === 'bottom') {
      listRef.current.scrollTo(0, bufferElementsCount * elementHeight);
    } else {
      listRef.current.scrollTo(0, bufferElementsCount * elementHeight);
    }
  }, [list]);

  return (
    <>
      VirtualList
      <div
        style={{
          height: `${boxHeight}px`,
          width: '350px',
          padding: '15px',
          border: '1px solid black',
          overflowY: 'scroll',
        }}
        ref={listRef}
      >
        {list.map((row) => {
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid brown',
                height: `${elementHeight}px`,
              }}
              key={row.id}
            >
              <span>{row.id}</span>
              <span>{row.name}</span>
              <span>{row.score}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

const VirtualListWrapper = () => {
  return (
    <VirtualList boxHeight={300} elementHeight={30} bufferElementsCount={5} />
  );
};

export default VirtualListWrapper;
