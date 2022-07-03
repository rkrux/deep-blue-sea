// Make it configurable based on box height and individual element height

import { faker } from '@faker-js/faker';
import { useEffect, useRef, useState } from 'react';
const allData = Array(1 * 100)
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
const LIST_LIMIT = 20;
const TIME_MS = 500;

const VirtualList = () => {
  const [list, setList] = useState(allData.slice(0, LIST_LIMIT));
  const cursorRef = useRef({ start: 0, end: LIST_LIMIT });
  const listRef = useRef(null);

  useEffect(() => {
    console.log('cursorRef: ', cursorRef.current);
    listRef.current.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newListEnd = cursorRef.current.end + LIST_LIMIT;
            const newList = allData.slice(cursorRef.current.end, newListEnd);
            if (newList.length === 0) {
              return;
            }

            setTimeout(() => {
              setList(newList);
              cursorRef.current = {
                start: cursorRef.current.end,
                end: newListEnd,
              };
            }, TIME_MS);
          }
        });
      },
      { ...OBSERVER_OPTIONS }
    );
    observer.observe(listRef.current.lastElementChild);

    return () => observer.disconnect();
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
                height: '50px',
              }}
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
