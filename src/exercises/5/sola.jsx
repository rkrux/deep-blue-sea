import { createContext, useContext, useReducer } from 'react';
import {
	CharacterInputProvider,
	useCharacterInput,
	characterLifecycleInitialState,
	fetchCharacterFromAPI,
	isInputValid,
} from '.';

const CharacterCacheContext = createContext();
function characterCacheLifecycleReducer(currentCache, cacheAction) {
	switch (cacheAction.type) {
		case 'fetchStart':
			return {
				...currentCache,
				[cacheAction.key]: {
					isLoading: true,
					isError: false,
					error: undefined,
					response: undefined,
				},
			};
		case 'fetchSuccess':
			return {
				...currentCache,
				[cacheAction.key]: {
					isLoading: false,
					isError: false,
					error: undefined,
					response: cacheAction.value,
				},
			};
		case 'fetchError':
			return {
				...currentCache,
				[cacheAction.key]: {
					isLoading: false,
					isError: true,
					error: cacheAction.value,
					response: undefined,
				},
			};
		case 'remove':
			delete currentCache[cacheAction.key];
			return currentCache;
		case 'clear':
			return {};
		default:
			throw new Error(
				`Invalid cacheAction type for characterCacheLifecycleReducer: ${cacheAction.type}`
			);
	}
}
function CharacterCacheProvider({ children }) {
	const [characterCache, dispatch] = useReducer(
		characterCacheLifecycleReducer,
		{}
	);

	return (
		<CharacterCacheContext.Provider value={{ characterCache, dispatch }}>
			{children}
		</CharacterCacheContext.Provider>
	);
}
function useCharacterCache(characterNumber) {
	const characterCacheData = useContext(CharacterCacheContext);
	if (!characterCacheData) {
		throw new Error(
			"useCharacterCache can't be used without CharacterCacheProvider"
		);
	}
	const { characterCache, dispatch } = characterCacheData;

	// Wrap in useCallback?
	const fetchAndSetCharacter = async (characterNumber) => {
		dispatch({ type: 'fetchStart', key: characterNumber });
		try {
			const asyncResponse = await fetchCharacterFromAPI(characterNumber);
			dispatch({
				type: 'fetchSuccess',
				key: characterNumber,
				value: asyncResponse,
			});
		} catch (error) {
			dispatch({ type: 'fetchError', key: characterNumber, value: error });
		}
	};
	const removeCharacterFromCache = () =>
		dispatch({ type: 'remove', key: characterNumber });
	const clearCharacterCache = () => dispatch({ type: 'clear' });

	const characterState =
		characterCache[characterNumber] ?? characterLifecycleInitialState;
	return {
		characterState,
		isCharacterInCache: !!characterState.response,
		allCachedCharacters: Object.values(characterCache).filter(
			(characterState) => !!characterState.response
		),
		fetchAndSetCharacter,
		removeCharacterFromCache,
		clearCharacterCache,
	};
}

function CharacterForm() {
	const [characterNumber, setCharacterNumber] = useCharacterInput();
	const { characterState, isCharacterInCache, fetchAndSetCharacter } =
		useCharacterCache(characterNumber);
	return (
		<div>
			<input
				placeholder="Pick a number"
				value={characterNumber ?? ''}
				onChange={(e) => setCharacterNumber(e.target.value)}
			/>
			<button
				disabled={!isInputValid(characterNumber) || characterState.isLoading}
				onClick={() => {
					fetchAndSetCharacter(characterNumber);
				}}
			>
				Fetch
			</button>
			<button
				disabled={characterState.isLoading}
				onClick={() => {
					const randomNumber = Math.floor(Math.random() * 500);
					setCharacterNumber(randomNumber);
					fetchAndSetCharacter(randomNumber);
				}}
			>
				Random
			</button>

			{isInputValid(characterNumber) &&
				(isCharacterInCache ? (
					<>This item is in cache.</>
				) : (
					<>This item is not in cache.</>
				))}

			{characterState.isError && <>Error in fetching character, try again!</>}
		</div>
	);
}
function CharacterCard() {
	const [characterNumber, setCharacterNumber] = useCharacterInput();
	const { characterState, isCharacterInCache, removeCharacterFromCache } =
		useCharacterCache(characterNumber);

	const renderCharacterState = () => {
		// Sanity check
		if (!isInputValid(characterNumber)) {
			return <>Start typing!</>;
		}

		if (characterState.isLoading) {
			return <>Loading character..</>;
		}
		if (characterState.isError) {
			return <>Error: {characterState.error}</>;
		}
		if (!isCharacterInCache) {
			return <>???</>;
		}
		return (
			<>
				<p>{`Character: ${characterState.response.characterNumber}, ${characterState.response.characterId}`}</p>
				<button
					onClick={() => {
						removeCharacterFromCache();
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
			{renderCharacterState()}
		</div>
	);
}
function CharactersCacheView() {
	const [characterNumber, setCharacterNumber] = useCharacterInput();
	const { allCachedCharacters, clearCharacterCache } =
		useCharacterCache(characterNumber);
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
									characterNumber === value.response.characterNumber
										? 'red'
										: 'green',
							}}
							onClick={() => setCharacterNumber(value.response.characterNumber)}
						>{`${value.response.characterNumber}-${value.response.characterId}`}</div>
					);
				})}
			</div>
			{allCachedCharacters.length > 0 && (
				<button onClick={clearCharacterCache}>Clear Cache</button>
			)}
		</div>
	);
}

function Sola() {
	return (
		<CharacterInputProvider>
			<CharacterCacheProvider>
				<CharacterForm />
				<CharacterCard />
				<CharactersCacheView />
			</CharacterCacheProvider>
		</CharacterInputProvider>
	);
}

export default Sola;

// Issues:
// If a request is rejected by the API, that error is shown when the same input is typed again
