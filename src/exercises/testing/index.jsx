import { createContext, useEffect, useState } from 'react';

const DummyContext = createContext();
function DummyProvider(props) {
	const { children } = props;
	return <DummyContext.Provider>{children}</DummyContext.Provider>;
}

const useTest = (input) => {
	const [state, setState] = useState({
		state: input,
		id: Math.floor(Math.random() * 1000),
	});

	useEffect(() => {
		const newState = {
			state: input,
			id: Math.floor(Math.random() * 1000),
		};
		setState(newState);
	}, [input]);

	return [state, setState];
};

const Child = (props) => {
	const { input } = props;
	const [state] = useTest(input);

	return (
		<>
			<p>Child State: {JSON.stringify(state)}</p>
		</>
	);
};

const Parent = () => {
	const [state, setState] = useState(0);

	return (
		<DummyProvider>
			<p>Parent State: {state}</p>
			<button onClick={() => setState(state + 1)}>Increment</button>
			<button onClick={() => setState(state - 1)}>Decrement</button>

			<Child input={state} />
		</DummyProvider>
	);
};

const Testing = () => {
	return <Parent />;
};

export default Testing;
