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
  Eight,
  Nine,
  Ten,
  Eleven,
  Twelve,
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
    title: 'TicTacToe',
    implementation: <One />,
  },
  {
    title: 'Vanilla Tilt',
    implementation: <Two />,
  },
  {
    title: 'Pokemons and error boundaries',
    implementation: <Three />,
  },
  {
    title: 'Fetch R&M Characters',
    implementation: <Four />,
  },
  {
    title: 'fetch-and-cache pattern with R&M Characters',
    implementation: <Five />,
  },
  {
    title: 'Exposing properties to the parent with a scrollable component',
    implementation: <Six />,
  },
  {
    title: "Debugging detecting user's screen sizes with useDebugValue",
    implementation: <Seven />,
  },
  {
    title: 'User Update forms',
    implementation: <Eight />,
  },
  {
    title: 'Flexible compound accordion components',
    implementation: <Nine />,
  },
  {
    title: 'Prop Collections',
    implementation: <Ten />,
  },
  {
    title: 'Add additional functionality with Prop Getters',
    implementation: <Eleven />,
  },
  {
    title: 'Accordion with user controlled configuration',
    implementation: <Twelve />,
  },
];

function App() {
  const [exerciseNumber, setExerciseNumber] = useState<Exercise>(11);
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <div className="basic">
        <ol>
          {exerciseConfigs.map((config, index) => (
            <li
              key={config.title}
              onClick={() => setExerciseNumber(index)}
              className={exerciseNumber === index ? 'selected' : 'unselected'}
            >
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
