import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import { fetchCharacterFromAPI, isInputValid } from '.';

const CacheContext = createContext();
function cacheReducer(currentCache, action) {
	switch (action.type) {
		case 'add':
			return {
				...currentCache,
				[action.key]: action.value,
			};
		case 'delete':
			delete currentCache[action.key];
			return currentCache;
		case 'clear':
			return {};
		default:
			throw new Error(`Invalid type for cacheReducer: ${action.type}`);
	}
}
function CacheProvider({ children }) {
	const [cache, dispatch] = useReducer(cacheReducer, {});
	// console.log('CacheProvider, cache: ', cache);
	return (
		<CacheContext.Provider value={[cache, dispatch]}>
			{children}
		</CacheContext.Provider>
	);
}
function useCache() {
	const cacheData = useContext(CacheContext);
	if (!cacheData) {
		throw new Error("useCache can't be used without CacheContext");
	}

	return cacheData;
}

const CharacterContext = createContext();
function characterReducer(currentCharacter, action) {
	switch (action.type) {
		case 'fetchStart':
			return {
				character: undefined,
				isLoading: true,
				isError: false,
				error: undefined,
				isInCache: false,
			};
		case 'fetchSuccess':
			return {
				character: action.payload,
				isLoading: false,
				isError: false,
				error: undefined,
				isInCache: true,
			};
		case 'fetchFail':
			return {
				character: undefined,
				isLoading: false,
				isError: true,
				error: action.payload,
				isInCache: false,
			};
		case 'cacheHit':
			return {
				character: action.payload,
				isLoading: false,
				isError: false,
				error: undefined,
				isInCache: true,
			};
		case 'cacheMiss':
			return {
				character: undefined,
				isLoading: false,
				isError: false,
				error: undefined,
				isInCache: false,
			};
		default:
			throw new Error(
				`Invalid action type for characterReducer: ${action.type}`
			);
	}
}
function CharacterProvider({ children }) {
	const [characterNumber, setCharacterNumber] = useState();
	const [characterDetails, dispatch] = useReducer(characterReducer, {
		character: undefined,
		isLoading: false,
		isError: false,
		error: undefined,
		isInCache: false,
	});

	console.log('CharacterProvider, characterDetails: ', characterDetails);
	return (
		<CharacterContext.Provider
			value={[characterNumber, setCharacterNumber, characterDetails, dispatch]}
		>
			{children}
		</CharacterContext.Provider>
	);
}
function useCharacter() {
	const characterData = useContext(CharacterContext);
	if (!characterData) {
		throw new Error("useCharacter can't be used without CharacterProvider");
	}
	const [characterNumber, _, __, characterDispatch] = characterData;
	const [cache] = useCache();

	useEffect(() => {
		const itemFromCache = cache[characterNumber];
		if (itemFromCache) {
			characterDispatch({ type: 'cacheHit', payload: itemFromCache });
		} else {
			characterDispatch({ type: 'cacheMiss' });
		}
	}, [characterNumber, cache, characterDispatch]);

	return characterData;
}
const fetchCharacter = async (characterDispatch, cacheDispatch, input) => {
	characterDispatch({ type: 'fetchStart' });
	try {
		const response = await fetchCharacterFromAPI(input);
		cacheDispatch({ type: 'add', key: input, value: response });
		characterDispatch({ type: 'fetchSuccess', payload: response });
	} catch (error) {
		characterDispatch({ type: 'fetchFail', payload: error });
	}
};

function CharacterForm() {
	const [
		characterNumber,
		setCharacterNumber,
		characterDetails,
		characterDispatch,
	] = useCharacter();
	const [_, cacheDispatch] = useCache();

	return (
		<div>
			<input
				placeholder="Pick a number"
				value={characterNumber ?? ''}
				onChange={(e) => setCharacterNumber(e.target.value)}
			/>
			<button
				disabled={!isInputValid(characterNumber) || characterDetails.isLoading}
				onClick={() => {
					fetchCharacter(characterDispatch, cacheDispatch, characterNumber);
				}}
			>
				Fetch
			</button>
			<button
				disabled={characterDetails.isLoading}
				onClick={() => {
					const randomNumber = Math.floor(Math.random() * 500);
					setCharacterNumber(randomNumber);
					fetchCharacter(characterDispatch, cacheDispatch, randomNumber);
				}}
			>
				Random
			</button>

			{isInputValid(characterNumber) &&
				(characterDetails.isInCache ? (
					<>This item is in cache.</>
				) : (
					<>This item is not in cache.</>
				))}

			{characterDetails.isError && <>Error in fetching character, try again!</>}
		</div>
	);
}

function CharacterCard() {
	const [characterNumber, setCharacterNumber, characterDetails] =
		useCharacter();
	const [_, cacheDispatch] = useCache();

	const renderCharacterDetails = () => {
		if (!isInputValid(characterNumber)) {
			return <>Start typing!</>;
		}

		if (characterDetails.isLoading) {
			return <>Loading character..</>;
		}
		if (characterDetails.isError) {
			return <>Error: {characterDetails.error}</>;
		}
		if (!characterDetails.isInCache) {
			return <>???</>;
		}
		return (
			<>
				<p>{`Character: ${characterDetails.character.characterNumber}, ${characterDetails.character.characterId}`}</p>
				<button
					onClick={() => {
						cacheDispatch({ type: 'delete', key: characterNumber });
						setCharacterNumber();
					}}
				>
					Remove from Cache
				</button>
			</>
		);
	};

	return (
		<div style={{ border: '1px solid', borderColor: 'greenyellow' }}>
			{renderCharacterDetails()}
		</div>
	);
}

function CharactersCacheView() {
	const [characterNumber, setCharacterNumber] = useCharacter();
	const [cache, dispatch] = useCache();

	const allCachedCharacters = Object.values(cache);
	return (
		<div style={{ border: '1px solid', borderColor: 'maroon' }}>
			<p>Cached items: {allCachedCharacters.length}</p>
			<div style={{ display: 'flex' }}>
				{allCachedCharacters.map((value, index) => {
					return (
						<div
							key={index}
							style={{
								border: '1px solid',
								borderRadius: '4px',
								borderColor:
									characterNumber === value.characterNumber ? 'red' : 'green',
							}}
							onClick={() => setCharacterNumber(value.characterNumber)}
						>{`${value.characterNumber}-${value.characterId}`}</div>
					);
				})}
			</div>
			{allCachedCharacters.length > 0 && (
				<button
					onClick={() => {
						dispatch({ type: 'clear' });
						setCharacterNumber();
					}}
				>
					Clear Cache
				</button>
			)}
		</div>
	);
}

function Solb() {
	return (
		<CacheProvider>
			<CharacterProvider>
				<CharacterForm />
				<CharacterCard />
				<CharactersCacheView />
			</CharacterProvider>
		</CacheProvider>
	);
}

export default Solb;

//Issues:
// In random selection, loading state doesn't appear, instead ??? is shown.
