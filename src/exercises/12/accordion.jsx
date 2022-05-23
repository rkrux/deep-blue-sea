import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useReducer,
} from 'react';

function combineReducers(reducers) {
  return (openItems, action) => {
    let prevOpenItems = openItems;
    let currentOpenItems;
    reducers.forEach((reducer) => {
      currentOpenItems = reducer(prevOpenItems, action);
      prevOpenItems = currentOpenItems;
    });
    return currentOpenItems;
  };
}

// Close any other open item before opening another one
function atMostOneItemOpenReducer(openItems, action) {
  switch (action.type) {
    case 'open':
      return openItems.length > 1 ? [0] : [action.index];
    case 'close':
      return openItems.filter((itemIndex) => itemIndex !== action.index);
    default:
      throw new Error(
        `Invalid action type ${action.type} for atMostOneItemOpenReducer`
      );
  }
}

// Don't let the last opened item be closed
function atLeastOneItemOpenReducer(openItems, action) {
  switch (action.type) {
    case 'open':
      return [...openItems, action.index];
    case 'close':
      return openItems.length === 1
        ? openItems
        : openItems.filter((itemIndex) => itemIndex !== action.index);
    default:
      throw new Error(
        `Invalid action type ${action.type} for atLeastOneItemOpenReducer`
      );
  }
}

function defaultReducer(openItems, action) {
  switch (action.type) {
    case 'open':
      return [...openItems, action.index];
    case 'close':
      return openItems.filter((itemIndex) => itemIndex !== action.index);
    default:
      throw new Error(`Invalid action type ${action.type} for defaultReducer`);
  }
}

function Accordion({ children, reducer = defaultReducer }) {
  const childArray = Children.toArray(children);
  const [openItems, dispatch] = useReducer(reducer, [0]); // TODO: Use Set here instead of Array to avoid duplicates

  return (
    <div>
      {childArray.map((child, index) => {
        if (child.type !== AccordionItem) {
          throw new Error(
            `child.type ${child.type} not alllowed inside Accordion FC`
          );
        }

        return (
          <>
            {cloneElement(child, {
              itemData: {
                isOpen: openItems.includes(index),
              },
              toggleItem: () =>
                dispatch({
                  type: openItems.includes(index) ? 'close' : 'open',
                  index,
                }),
            })}
          </>
        );
      })}
    </div>
  );
}

const AccordionItemContext = createContext();
function AccordionItemProvider({ children, itemData, toggleItem }) {
  return (
    <AccordionItemContext.Provider value={[itemData, toggleItem]}>
      {children}
    </AccordionItemContext.Provider>
  );
}
function useAccordionItemContext() {
  const accordionItemContext = useContext(AccordionItemContext);
  if (!accordionItemContext) {
    throw new Error(
      'useAccordionItemContext unable to be used w/o AccordionItemProvider'
    );
  }
  return accordionItemContext;
}
function AccordionItem(props) {
  const { children, itemData, toggleItem, ...restProps } = props;

  return (
    <AccordionItemProvider itemData={itemData} toggleItem={toggleItem}>
      <div {...restProps}>{children}</div>
    </AccordionItemProvider>
  );
}

function AccordionPanel({ children, ...restProps }) {
  const [itemData] = useAccordionItemContext();
  if (!itemData.isOpen) {
    return null;
  }

  return <div {...restProps}>{children}</div>;
}

function AccordionButton({ children, handleOnClick, ...restProps }) {
  const [_, toggleItem] = useAccordionItemContext();
  const onClickHandler = handleOnClick ?? toggleItem;

  return (
    <button onClick={onClickHandler} {...restProps}>
      {children}
    </button>
  );
}

function AccordionButtonOpen({ children }) {
  const [itemData, toggleItem] = useAccordionItemContext();
  if (itemData.isOpen) {
    return null;
  }

  return (
    <AccordionButton handleOnClick={toggleItem}>{children}</AccordionButton>
  );
}

function AccordionButtonClose({ children }) {
  const [itemData, toggleItem] = useAccordionItemContext();
  if (!itemData.isOpen) {
    return null;
  }

  return (
    <AccordionButton handleOnClick={toggleItem}>{children}</AccordionButton>
  );
}

export {
  atMostOneItemOpenReducer,
  atLeastOneItemOpenReducer,
  defaultReducer,
  combineReducers,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButtonOpen,
  AccordionButtonClose,
};
