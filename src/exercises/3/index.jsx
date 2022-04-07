import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

const buildPokemonQuery = (pokemonName) => `{
  query {
    pokemon(name: "${pokemonName}") {
      id
      number
      name
      attacks {
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        number
        name
        weight {
          minimum
          maximum
        }
        attacks {
          fast {
            name
            type
            damage
          }
        }
      }
    }
  }
}`;

async function fetchPokemon(pokemonName) {
  const response = await fetch('https://graphql-pokemon2.vercel.app/', {
    method: 'POST',
    body: JSON.stringify({ query: buildPokemonQuery(pokemonName) }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

const usePokemon = (pokemonName, enabled = true) => {
  return useQuery(['pokemon', pokemonName], () => fetchPokemon(pokemonName), {
    enabled,
  });
};

const extractPokemonDetails = (pokemonData) => {
  return {
    name: pokemonData.name,
    number: pokemonData.number,
    image: pokemonData.image,
    attacks: pokemonData.attacks.special,
  };
};

function PokemonCard({ pokemonName, tryAgain }) {
  const pokemonQueryResult = usePokemon(pokemonName);

  if (!pokemonName) {
    return <div>Please submit a pokemon!</div>;
  }

  if (pokemonQueryResult.isLoading) {
    return <div>Loading...</div>;
  }

  if (pokemonQueryResult.isError) {
    return <div>{`${pokemonQueryResult.error}`}</div>;
  }

  if (
    !pokemonQueryResult.data ||
    pokemonQueryResult.data.data.query.pokemon === null
  ) {
    return (
      <div>
        <span>{`The pokemon "${pokemonName}" is not in the database.`}</span>
        <div onClick={tryAgain}>Try again</div>
      </div>
    );
  }

  const pokemonDetails = extractPokemonDetails(
    pokemonQueryResult.data.data.query.pokemon
  );
  return (
    <div id="pokemonDetails">
      <div>{`${pokemonDetails.name} ${pokemonDetails.number}`}</div>
      <img src={`${pokemonDetails.image}`} />
      <table>
        <thead>
          <tr>
            <th>Ability</th>
            <th>Type</th>
            <th>Damage</th>
          </tr>
        </thead>
        <tbody>
          {pokemonDetails.attacks.map((attack) => {
            return (
              <tr>
                <td>{attack.name}</td>
                <td>{attack.type}</td>
                <td>{attack.damage}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PokemonForm({ pokemonName: externalPokemonName, onSubmit }) {
  const [pokemonName, setPokemonName] = useState(externalPokemonName);

  useEffect(() => {
    setPokemonName(externalPokemonName);
  }, [externalPokemonName]);

  return (
    <form
      id="pokemonInput"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(pokemonName);
      }}
    >
      <input
        type="text"
        id="pokemonName"
        placeholder="Which pokemon?"
        value={pokemonName}
        onChange={(event) => setPokemonName(event.target.value)}
      />
      <input type="submit" value="Fetch!" />
      <div>
        Out of ideas? Try{' '}
        <span onClick={() => setPokemonName('Pikachu')}>Pikachu</span>,
        <span onClick={() => setPokemonName('Charizard')}> Charizard</span>, or
        <span onClick={() => setPokemonName('Ninetales')}> Ninetales</span>.
      </div>
    </form>
  );
}

function Three() {
  const [pokemonName, setPokemonName] = useState('');
  return (
    <>
      <PokemonForm
        pokemonName={pokemonName}
        onSubmit={(finalName) => {
          setPokemonName(finalName);
        }}
      />
      <PokemonCard
        pokemonName={pokemonName}
        tryAgain={() => setPokemonName('')}
      />
    </>
  );
}

export default Three;
