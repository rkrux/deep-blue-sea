import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

const generateRandomId = () => Math.floor(Math.random() * 826);

function useRickAndMorty(characterId, enabled = true) {
  return useQuery(
    ['rickandmorty', characterId],
    async () => {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/${characterId}`
      );
      return response.json();
    },
    { enabled }
  );
}

function RickAndMortyCharacter({ queryResult }) {
  const { isLoading, isError, error, data } = queryResult;

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>{error.message}</>;
  }

  if (data.error) {
    return <>{data.error}</>;
  }

  const { id, name, status, species, gender, image } = data;
  return (
    <>
      <img src={`${image}`} alt="No image found" height={50} width={50} />
      <br />
      {`${id}, ${name}, ${status}`}
      <br />
      {`${species}, ${gender}`}
    </>
  );
}

function RickAndMortySearch({
  characterId: externalCharacterId,
  onFetch,
  queryResult,
}) {
  const [characterId, setCharacterId] = useState(externalCharacterId);

  return (
    <>
      <div>
        <button
          onClick={() => {
            const id = generateRandomId();
            setCharacterId(id);
            onFetch(id);
          }}
          disabled={queryResult.isLoading}
        >
          Random
        </button>
        <input
          type="number"
          placeholder="Pick a number"
          value={characterId}
          onChange={(event) => setCharacterId(event.target.value)}
        />
        <button
          onClick={() => onFetch(characterId)}
          disabled={
            queryResult.isLoading || externalCharacterId === characterId
          }
        >
          Fetch
        </button>
      </div>
      <span>Which Rick and Morty character?</span>
    </>
  );
}

function RickAndMorty() {
  const [characterId, setCharacterId] = useState();
  const { refetch, isIdle, ...queryResult } = useRickAndMorty(
    characterId,
    false
  );

  useEffect(() => {
    if (characterId) {
      refetch();
    }
  }, [characterId, refetch]);

  return (
    <>
      <RickAndMortySearch
        characterId={characterId}
        onFetch={(characterId) => {
          setCharacterId(characterId);
        }}
        queryResult={queryResult}
      />
      <br />
      {isIdle && <>Start fetching!</>}
      {!isIdle && <RickAndMortyCharacter queryResult={queryResult} />}
    </>
  );
}

function Four() {
  const [isVisible, toggleVisbility] = useState(true);

  return (
    <div>
      <input
        type={'checkbox'}
        checked={isVisible}
        onChange={() => {
          toggleVisbility(!isVisible);
        }}
      />
      Mount the search bar
      {isVisible && <RickAndMorty />}
    </div>
  );
}

export default Four;
