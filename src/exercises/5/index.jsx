import { createContext, useContext, useState } from 'react';
import Sola from './sola';
import Solb from './solb';

export const isInputValid = (input) => input;

export function fetchCharacterFromAPI(characterNumber) {
  return new Promise((resolve, reject) => {
    const randomId = Math.floor(Math.random() * 1000);
    setTimeout(() => {
      if (randomId < 900) {
        resolve({ characterNumber: characterNumber, characterId: randomId });
      } else {
        reject(
          `API rejected the request to fetch the character: ${characterNumber}, time: ${randomId}`
        );
      }
    }, randomId);
  });
}
export const characterLifecycleInitialState = {
  isLoading: false,
  isError: false,
  error: undefined,
  response: undefined,
};

export const CharacterInputContext = createContext();
export function CharacterInputProvider({ children }) {
  const [characterNumber, setCharacterNumber] = useState();
  return (
    <CharacterInputContext.Provider
      value={[characterNumber, setCharacterNumber]}
    >
      {children}
    </CharacterInputContext.Provider>
  );
}
export function useCharacterInput() {
  const characterInput = useContext(CharacterInputContext);
  if (!characterInput) {
    throw new Error(
      "useCharacterInput can't be used without the CharacterInputProvider"
    );
  }
  return characterInput;
}

function Five() {
  const [sol, setSol] = useState('solb');
  return (
    <>
      <button onClick={() => setSol('sola')} disabled={sol === 'sola'}>
        Solution A
      </button>
      <button onClick={() => setSol('solb')} disabled={sol === 'solb'}>
        Solution B
      </button>
      {sol === 'sola' && <Sola />}
      {sol === 'solb' && <Solb />}
    </>
  );
}

export default Five;
