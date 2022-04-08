import React, { createContext, useEffect, useState } from 'react';

const DummyContext = createContext();
function DummyProvider(props) {
	console.log('DummyProvider, props: ', props);
	const { children } = props;
	console.log(
		'DummyProvider, children: ',
		children,
		'toArray: ',
		React.Children.toArray(children)
	);
	return <DummyContext.Provider>{children}</DummyContext.Provider>;
}

const useTest = (input) => {
	const [state, setState] = useState({
		state: input,
		id: Math.floor(Math.random() * 1000),
	});

	useEffect(() => {
		// console.log(
		// 	'After useTest return in useEffect before setState: ',
		// 	input,
		// 	state
		// );
		const newState = {
			state: input,
			id: Math.floor(Math.random() * 1000),
		};
		setState(newState);
		// console.log(
		// 	'After useTest return in useEffect after setState: ',
		// 	input,
		// 	state,
		// 	newState
		// );
	}, [input]);

	// console.log('Before useTest return: ', input, state);
	return [state, setState];
};

const Child = (props) => {
	console.log('Child, props: ', props);
	const { input } = props;
	const [state] = useTest(input);

	// console.log('Before Child render: ', input, state);
	return (
		<>
			{/* {console.log('During Child, render: ', input, state)} */}
			<p>Child State: {JSON.stringify(state)}</p>
		</>
	);
};

const Parent = () => {
	const [state, setState] = useState(0);

	// console.log('Before Parent render: ', state);
	return (
		<DummyProvider>
			<p>Parent State: {state}</p>
			<button onClick={() => setState(state + 1)}>Increment</button>
			<button onClick={() => setState(state - 1)}>Decrement</button>
			{/* {console.log('During Parent render before Child: ', state)} */}
			<Child input={state} />
			{/* {console.log('During Parent render after Child: ', state)} */}
		</DummyProvider>
	);
};

const Testing = () => {
	return <Parent />;
};

export default Testing;
