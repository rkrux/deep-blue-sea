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
const LIST_LIMIT = 50;
const BUFFER = 10;
const TIME_MS = 1500;
const ELEMENT_HEIGHT_PX = 50;

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

const VirtualList = () => {
  const [list, setList] = useState(allData.slice(0, LIST_LIMIT));
  const cursorRef = useRef({
    start: 0,
    end: LIST_LIMIT,
    topOrBottom: 'bottom',
  });
  const listRef = useRef(null);

  useIntersectionObserver(listRef, [list], 'bottom', (entry) => {
    if (entry.isIntersecting) {
      const newListEnd = cursorRef.current.end + LIST_LIMIT;
      const newList = allData.slice(
        Math.max(0, cursorRef.current.end - BUFFER),
        newListEnd
      );
      if (newList.length === 0) {
        return;
      }

      setTimeout(() => {
        setList(newList);
        cursorRef.current = {
          start: cursorRef.current.end,
          end: newListEnd,
          topOrBottom: 'bottom',
        };
      }, TIME_MS);
    }
  });

  useIntersectionObserver(listRef, [list], 'top', (entry) => {
    if (entry.isIntersecting) {
      const newListStart = cursorRef.current.start - LIST_LIMIT;
      const newList = allData.slice(
        newListStart,
        Math.min(cursorRef.current.start + BUFFER, allData.length)
      );
      if (newList.length === 0) {
        return;
      }

      setTimeout(() => {
        setList(newList);
        cursorRef.current = {
          start: newListStart,
          end: cursorRef.current.start,
          topOrBottom: 'top',
        };
      }, TIME_MS);
    }
  });

  useEffect(() => {
    console.log('cursorRef: ', cursorRef.current);
    if (cursorRef.current.topOrBottom === 'bottom') {
      listRef.current.scrollTo(0, BUFFER * ELEMENT_HEIGHT_PX);
    } else {
      listRef.current.scrollTo(0, (LIST_LIMIT - BUFFER) * ELEMENT_HEIGHT_PX);
    }
  }, [list]);

  return (
    <>
      VirtualList
      <div
        style={{
          height: '300px',
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
                height: `${ELEMENT_HEIGHT_PX}px`,
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

export default VirtualList;
