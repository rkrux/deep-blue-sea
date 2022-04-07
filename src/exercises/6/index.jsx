import { useState } from 'react';
import Sola from './sola';
import Solb from './solb';

function Six() {
  const [solution, setSolution] = useState('solb');
  return (
    <>
      <button
        disabled={solution === 'sola'}
        onClick={() => setSolution('sola')}
      >
        Solution A
      </button>
      <button
        disabled={solution === 'solb'}
        onClick={() => setSolution('solb')}
      >
        Solution B
      </button>
      <div>{solution === 'sola' && <Sola />}</div>
      <div>{solution === 'solb' && <Solb />}</div>
    </>
  );
}

export default Six;
