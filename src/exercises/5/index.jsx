import { createContext, useContext, useReducer, useState } from 'react';

const isInputValid = (input) => input;

function fetchCharacterFromAPI(characterNumber) {
	return new Promise((resolve, reject) => {
		const randomId = Math.floor(Math.random() * 1000);
		setTimeout(() => {
			if (randomId < 950) {
				resolve({ characterNumber: characterNumber, characterId: randomId });
			} else {
				reject(
					`API rejected the request to fetch the character: ${characterNumber}, time: ${randomId}`
				);
			}
		}, randomId);
	});
}
const characterLifecycleInitialState = {
	isLoading: false,
	isError: false,
	error: undefined,
	response: undefined,
};
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

const CharacterCacheContext = createContext();
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

const CharacterInputContext = createContext();
function CharacterInputProvider({ children }) {
	const [characterNumber, setCharacterNumber] = useState();
	return (
		<CharacterInputContext.Provider
			value={[characterNumber, setCharacterNumber]}
		>
			{children}
		</CharacterInputContext.Provider>
	);
}
function useCharacterInput() {
	const characterInput = useContext(CharacterInputContext);
	if (!characterInput) {
		throw new Error(
			"useCharacterInput can't be used without the CharacterInputProvider"
		);
	}
	return characterInput;
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

function Five() {
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

export default Five;
