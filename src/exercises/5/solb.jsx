import { createContext, useContext, useReducer } from 'react';
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
		case 'change':
			return {
				characterNumber: action.payload.characterNumber,
				character: action.payload.characterFromCache,
				isLoading: false,
				isError: false,
				error: undefined,
			};
		case 'fetchStart':
			return {
				...currentCharacter,
				character: undefined,
				isLoading: true,
				isError: false,
				error: undefined,
			};
		case 'fetchSuccess':
			return {
				...currentCharacter,
				character: action.payload,
				isLoading: false,
				isError: false,
				error: undefined,
			};
		case 'fetchFail':
			return {
				...currentCharacter,
				character: undefined,
				isLoading: false,
				isError: true,
				error: action.payload,
			};
		default:
			throw new Error(
				`Invalid action type for characterReducer: ${action.type}`
			);
	}
}
function CharacterProvider({ children }) {
	const [characterDetails, dispatch] = useReducer(characterReducer, {
		characterNumber: undefined,
		character: undefined,
		isLoading: false,
		isError: false,
		error: undefined,
	});

	return (
		<CharacterContext.Provider value={[characterDetails, dispatch]}>
			{children}
		</CharacterContext.Provider>
	);
}
function useCharacter() {
	const characterData = useContext(CharacterContext);
	if (!characterData) {
		throw new Error("useCharacter can't be used without CharacterProvider");
	}
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
	const [characterDetails, characterDispatch] = useCharacter();
	const [cache, cacheDispatch] = useCache();

	return (
		<div>
			<input
				placeholder="Pick a number"
				value={characterDetails.characterNumber ?? ''}
				onChange={(e) => {
					const newNumber = e.target.value;
					characterDispatch({
						type: 'change',
						payload: {
							characterNumber: newNumber,
							characterFromCache: cache[newNumber],
						},
					});
				}}
			/>
			<button
				disabled={
					!isInputValid(characterDetails.characterNumber) ||
					characterDetails.isLoading
				}
				onClick={() => {
					fetchCharacter(
						characterDispatch,
						cacheDispatch,
						characterDetails.characterNumber
					);
				}}
			>
				Fetch
			</button>
			<button
				disabled={characterDetails.isLoading}
				onClick={() => {
					const randomNumber = Math.floor(Math.random() * 500);
					characterDispatch({
						type: 'change',
						payload: {
							characterNumber: randomNumber,
							characterFromCache: cache[randomNumber],
						},
					});
					fetchCharacter(characterDispatch, cacheDispatch, randomNumber);
				}}
			>
				Random
			</button>

			{isInputValid(characterDetails.characterNumber) &&
				(cache[characterDetails.characterNumber] ? (
					<>This item is in cache.</>
				) : (
					<>This item is not in cache.</>
				))}

			{characterDetails.isError && <>Error in fetching character, try again!</>}
		</div>
	);
}

function CharacterCard() {
	const [characterDetails, characterDispatch] = useCharacter();
	const [cache, cacheDispatch] = useCache();

	const renderCharacterDetails = () => {
		if (!isInputValid(characterDetails.characterNumber)) {
			return <>Start typing!</>;
		}

		if (characterDetails.isLoading) {
			return <>Loading character..</>;
		}
		if (characterDetails.isError) {
			return <>Error: {characterDetails.error}</>;
		}
		if (!cache[characterDetails.characterNumber]) {
			return <>???</>;
		}
		return (
			<>
				<p>{`Character: ${characterDetails.character.characterNumber}, ${characterDetails.character.characterId}`}</p>
				<button
					onClick={() => {
						cacheDispatch({
							type: 'delete',
							key: characterDetails.characterNumber,
						});
						characterDispatch({
							type: 'change',
							payload: {
								characterNumber: undefined,
								characterFromCache: undefined,
							},
						});
					}}
				>
					Remove from Cache
				</button>
			</>
		);
	};

	return (
		<div style={{ border: '1px solid', borderColor: 'indianred' }}>
			{renderCharacterDetails()}
		</div>
	);
}

function CharactersCacheView() {
	const [characterDetails, characterDispatch] = useCharacter();
	const [cache, cacheDispatch] = useCache();

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
									characterDetails.characterNumber === value.characterNumber
										? 'red'
										: 'green',
							}}
							onClick={() =>
								characterDispatch({
									type: 'change',
									payload: {
										characterNumber: value.characterNumber,
										characterFromCache: cache[value.characterNumber],
									},
								})
							}
						>{`${value.characterNumber}-${value.characterId}`}</div>
					);
				})}
			</div>
			{allCachedCharacters.length > 0 && (
				<button
					onClick={() => {
						cacheDispatch({ type: 'clear' });
						characterDispatch({
							type: 'change',
							payload: {
								characterNumber: undefined,
								characterFromCache: undefined,
							},
						});
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
