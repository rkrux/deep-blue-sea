import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
// import { isEqual } from 'lodash';

function asyncFn(requestData) {
  const randomId = Math.floor(Math.random() * 2000);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomId < 1600) {
        resolve({ id: randomId, ...requestData });
      } else {
        reject(`API rejected request for some untold reason: ${randomId}`);
      }
    }, randomId);
  });
}

const isUserDataValid = (userData) => userData.name;

function asyncFunctionReducer(currentState, action) {
  switch (action.type) {
    case 'start':
      return {
        isLoading: true,
        isError: false,
        error: undefined,
        data: undefined,
      };
    case 'successful':
      return { ...currentState, data: action.payload };
    case 'error':
      return { ...currentState, isError: true, error: action.payload };
    case 'stop':
      return { ...currentState, isLoading: false };
    default:
      throw new Error('Invalid action for reducer');
  }
}

function useAsyncFunction(asyncFunction, request, { executeOnMount = true }) {
  const [asyncState, updateAsyncState] = useReducer(asyncFunctionReducer, {
    isLoading: executeOnMount,
    isError: false,
    error: undefined,
    data: undefined,
  });

  const refetch = async () => {
    updateAsyncState({ type: 'start' });
    try {
      const response = await asyncFunction(request);
      updateAsyncState({ type: 'successful', payload: response });
    } catch (error) {
      updateAsyncState({ type: 'error', payload: error });
    } finally {
      updateAsyncState({ type: 'stop' });
    }
  };

  useEffect(() => {
    if (executeOnMount) {
      refetch();
    }
  }, []);

  return { ...asyncState, refetch };
}

function UserForm({
  userData: externalUserData,
  onSubmit,
  asyncFunctionResult,
}) {
  const [userData, setUserData] = useState(externalUserData);

  return (
    <div>
      <input
        type="text"
        placeholder="Name*"
        required
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Biography"
        value={userData.bio}
        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
      />
      <button
        onClick={() => setUserData(externalUserData)}
        disabled={asyncFunctionResult.isLoading}
      >
        Reset
      </button>
      <button
        onClick={() => onSubmit(userData)}
        disabled={asyncFunctionResult.isLoading || !isUserDataValid(userData)}
      >
        Submit
      </button>
      {asyncFunctionResult.isError && <>{asyncFunctionResult.error}</>}
    </div>
  );
}

function UserId({ asyncFunctionResult }) {
  if (asyncFunctionResult.isLoading) {
    return <p>Id: Loading...</p>;
  }
  if (asyncFunctionResult.isError) {
    return <></>;
  }
  // Why is this the case? How do we handle this intermediate render case?
  if (!asyncFunctionResult.data) {
    return <></>;
  }
  return <p>Id: {asyncFunctionResult.data.id}</p>;
}

function UserCard({ userData, asyncFunctionResult }) {
  if (!isUserDataValid(userData)) {
    return <>User Card will appear here!</>;
  }

  return (
    <div>
      User Card
      <p>Name: {userData.name}</p>
      <p>Bio: {userData.bio}</p>
      <UserId asyncFunctionResult={asyncFunctionResult} />
    </div>
  );
}

function Eight() {
  const [userData, setUserData] = useState({ name: '', bio: '' });
  const asyncFunctionResult = useAsyncFunction(asyncFn, userData, {
    executeOnMount: false,
  });

  useEffect(() => {
    if (isUserDataValid(userData)) {
      asyncFunctionResult.refetch();
    }
  }, [userData]);

  return (
    <div>
      <UserForm
        userData={userData}
        asyncFunctionResult={asyncFunctionResult}
        onSubmit={(newUserData) => {
          setUserData(newUserData);
        }}
      />
      <UserCard userData={userData} asyncFunctionResult={asyncFunctionResult} />
    </div>
  );
}

export default Eight;
