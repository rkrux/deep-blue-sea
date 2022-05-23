import { useState } from 'react';
import {
  atLeastOneItemOpenReducer,
  atMostOneItemOpenReducer,
  combineReducers,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButtonOpen,
  AccordionButtonClose,
} from './accordion';

const accordionData = Array.from({ length: 10 }, (_, index) => {
  return {
    id: index,
    data: Math.floor(Math.random() * 1000),
  };
});

export default function Twelve() {
  const [accordionConfig, setAccordionConfig] = useState({
    atMostOneItemOpen: true,
    atLeastOneItemOpen: true,
  });

  return (
    <>
      <div>
        <ul>
          <li>
            atMostOneItemOpen: {String(accordionConfig.atMostOneItemOpen)}{' '}
            {'->'}
            <button
              onClick={() => {
                setAccordionConfig({
                  ...accordionConfig,
                  atMostOneItemOpen: !accordionConfig.atMostOneItemOpen,
                });
              }}
            >
              (change)
            </button>
          </li>
          <li>
            atLeastOneItemOpen: {String(accordionConfig.atLeastOneItemOpen)}{' '}
            {'->'}
            <button
              onClick={() => {
                setAccordionConfig({
                  ...accordionConfig,
                  atLeastOneItemOpen: !accordionConfig.atLeastOneItemOpen,
                });
              }}
            >
              (change)
            </button>
          </li>
        </ul>
      </div>
      <Accordion
        reducer={combineReducers([
          atLeastOneItemOpenReducer,
          atMostOneItemOpenReducer,
        ])}
      >
        {accordionData.map((value) => {
          return (
            <AccordionItem>
              <AccordionButtonOpen>▼ Open: {value.id} ▼</AccordionButtonOpen>
              <AccordionButtonClose>▲ Close: {value.id} ▲</AccordionButtonClose>
              <AccordionPanel>{JSON.stringify(value)}</AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
}
