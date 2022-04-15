import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
	One,
	Two,
	Three,
	Four,
	Five,
	Six,
	Seven,
	ComingSoon,
	Eight,
	Nine,
	Ten,
	Eleven,
	Twelve,
	Thirteen,
	Fourteen,
	Testing,
} from './exercises';
import './App.css';

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

type Exercise = number;
type ExerciseConfig = {
	title: string;
	implementation: ReactNode;
};

const exerciseConfigs: ExerciseConfig[] = [
	{
		title: 'TicTacToe and avoiding state management complexity',
		implementation: <One />,
	},
	{
		title: 'Vanilla Tilt, direct DOM access and Memory Leaks',
		implementation: <Two />,
	},
	{
		title: 'Fetching Pokemons and error boundaries',
		implementation: <Three />,
	},
	{
		title: 'Safely fetch Rick and Morty Characters handling Async operations',
		implementation: <Four />,
	},
	{
		title: 'Simple fetch-and-cache pattern with Rick and Morty Characters',
		implementation: <Five />,
	},
	{
		title:
			'Exposing properties to the parent with a scrollable component using forwardRef and useImperativeHandle',
		implementation: <Six />,
	},
	{
		title:
			"Showing Big Head Avatars and debugging detecting user's screen sizes with useDebugValue",
		implementation: <Seven />,
	},
	{
		title: 'User Update forms and the context modules function pattern',
		implementation: <Eight />,
	},
	{
		title: 'Designing flexible compound accordion components',
		implementation: <Nine />,
	},
	{
		title: 'Prop Collections and useAnimatedCounter',
		implementation: <Ten />,
	},
	{
		title:
			'Add additional functionality to useAnimatedCounter with Prop Getters',
		implementation: <Eleven />,
	},
	{
		title:
			"The State Reducer Pattern to modify an accordion component's default behavior",
		implementation: <Twelve />,
	},
	{
		title: 'Understanding control props with a simple button component',
		implementation: <ComingSoon exerciseNumber={13} />,
	},
	{
		title: 'Creating a controllable Rating component',
		implementation: <ComingSoon exerciseNumber={14} />,
	},
	{
		title: 'Optimized rendering of large lists of items with React-Virtual',
		implementation: <ComingSoon exerciseNumber={15} />,
	},
	{
		title: 'Testing',
		implementation: <Testing />,
	},
];

function App() {
	const [exerciseNumber, setExerciseNumber] = useState<Exercise>(11);
	return (
		// Provide the client to your App
		<QueryClientProvider client={queryClient}>
			<div className="basic">
				<header>Exercises</header>
				<ol>
					{exerciseConfigs.map((config, index) => (
						<li key={config.title} onClick={() => setExerciseNumber(index)}>
							{config.title}
						</li>
					))}
				</ol>
				<hr />
				<div>{exerciseConfigs[exerciseNumber].implementation}</div>
			</div>
		</QueryClientProvider>
	);
}

export default App;
