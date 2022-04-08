import {
	Children,
	cloneElement,
	createContext,
	useContext,
	useReducer,
	useState,
} from 'react';

const accordionData = Array.from({ length: 10 }, (_, index) => {
	return {
		id: index,
		data: Math.floor(Math.random() * 1000),
	};
});
/*
const AccordContext = createContext();
function AccordProvider({ children }) {
	const [itemOpened, setItemOpened] = useState();
	return (
		<AccordContext.Provider value={[itemOpened, setItemOpened]}>
			{children}
		</AccordContext.Provider>
	);
}
function useAccordContext() {
	const accordContext = useContext(AccordContext);
	if (!accordContext) {
		throw new Error('useAccordContext unable to be used w/o AccordProvider');
	}
	return accordContext;
}
*/

const AccordItemContext = createContext();
function AccordItemProvider({ children, index }) {
	const [itemData, itemDispatch] = useReducer(
		(currentItemData, action) => {
			switch (action.type) {
				case 'toggleOpeness':
					return {
						...currentItemData,
						isOpened: action.payload,
					};
				default:
					throw new Error(
						`Invalid action.type for actionItemReducer: ${action.type}`
					);
			}
		},
		{ index, isOpened: false }
	);

	return (
		<AccordItemContext.Provider value={[itemData, itemDispatch]}>
			{children}
		</AccordItemContext.Provider>
	);
}
function useAccordItemContext() {
	const accordItemContext = useContext(AccordItemContext);
	if (!accordItemContext) {
		throw new Error(
			'useAccordItemContext unable to be used w/o AccordItemProvider'
		);
	}
	return accordItemContext;
}

function Accord({ children }) {
	const childArray = Children.toArray(children);

	return (
		<div>
			{/* TODO: Add keys */}
			{childArray.map((child, index) => {
				// Does this work in Production?
				if (child.type !== AccordItem) {
					throw new Error(
						`child.type ${child.type} not alllowed inside Accord FC`
					);
				}
				return (
					<AccordItemProvider index={index}>
						{cloneElement(child)}
					</AccordItemProvider>
				);
			})}
		</div>
	);
}

function AccordItem(props) {
	const { children, ...restProps } = props;

	return (
		<div {...restProps}>
			{Children.toArray(children).map((child) => {
				return <div>{child}</div>;
			})}
		</div>
	);
}

function AccordPanel({ children, ...restProps }) {
	const [itemData] = useAccordItemContext();
	if (!itemData.isOpened) {
		return null;
	}

	return <div {...restProps}>{children}</div>;
}

function AccordButton({ children, handleOnClick, ...restProps }) {
	const [itemData, itemDispatch] = useAccordItemContext();

	const onClickHandler =
		handleOnClick ??
		(() =>
			itemDispatch({ type: 'toggleOpeness', payload: !itemData.isOpened }));

	return (
		<button onClick={onClickHandler} {...restProps}>
			{children}
		</button>
	);
}

function AccordButtonOpen({ children }) {
	const [itemData, itemDispatch] = useAccordItemContext();
	if (itemData.isOpened) {
		return null;
	}

	return (
		<AccordButton
			handleOnClick={() =>
				itemDispatch({ type: 'toggleOpeness', payload: true })
			}
		>
			{children}
		</AccordButton>
	);
}

function AccordButtonClose({ children }) {
	const [itemData, itemDispatch] = useAccordItemContext();
	if (!itemData.isOpened) {
		return null;
	}

	return (
		<AccordButton
			handleOnClick={() =>
				itemDispatch({ type: 'toggleOpeness', payload: false })
			}
		>
			{children}
		</AccordButton>
	);
}

function Accordion({ useOtherAccordion }) {
	if (useOtherAccordion) {
		return (
			<Accord>
				{accordionData.map((value) => {
					return (
						<AccordItem>
							<AccordButtonOpen>▼ Open: {value.id} ▼</AccordButtonOpen>
							<AccordButtonClose>▲ Close: {value.id} ▲</AccordButtonClose>
							<AccordPanel>{JSON.stringify(value)}</AccordPanel>
						</AccordItem>
					);
				})}
			</Accord>
		);
	}

	return (
		<Accord>
			{/* <div>Cause error</div> */}
			{accordionData.map((value, index) => {
				return (
					<AccordItem style={{ margin: '10px' }}>
						<div style={{ display: 'flex' }}>
							{index % 2 === 1 ? (
								<>
									<AccordButton
										style={{ border: '1px solid red', margin: '5px' }}
									>
										Item: {value.id}
									</AccordButton>
									<AccordPanel
										style={{ border: '1px solid green', margin: '5px' }}
									>
										{JSON.stringify(value)}
									</AccordPanel>
								</>
							) : (
								<>
									<AccordPanel
										style={{ border: '1px solid green', margin: '5px' }}
									>
										{JSON.stringify(value)}
									</AccordPanel>
									<AccordButton
										style={{ border: '1px solid red', margin: '5px' }}
									>
										Item: {value.id}
									</AccordButton>
								</>
							)}
						</div>
					</AccordItem>
				);
			})}
		</Accord>
	);
}

function Nine() {
	const [useOtherAccordion, setUseOtherAccordion] = useState(false);
	return (
		<>
			<p>
				<button onClick={() => setUseOtherAccordion(!useOtherAccordion)}>
					Use Other Accordion
				</button>
			</p>
			<Accordion useOtherAccordion={useOtherAccordion} />
		</>
	);
}

export default Nine;
