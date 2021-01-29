import React, { createContext, useReducer } from 'react';
import {
  UserContextDispatch,
  UserContextDispatchAction,
  UserProviderProps,
  UserProviderState,
} from '../types/UserProvider';

const initialState: UserProviderState = {
  user: undefined,
};

const UserStateContext = createContext<UserProviderState | undefined>(undefined);
const UserDispatchContext = createContext<UserContextDispatch | undefined>(undefined);
const reducer = (state: any, action: UserContextDispatchAction) => {
  const actionType = action.type;
  let newState;

  switch (actionType) {
    case 'user':
      newState = { ...state, user: action.payload };
      break;
    default:
      throw new Error(`Unhandled action type: ${actionType}`);
  }

  return newState;
};

const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

function useUserState(): UserProviderState {
  const context = React.useContext(UserStateContext);

  if (context === undefined) {
    throw new Error('useChainState must be used within a ChainProvider.');
  }

  return context;
}

function useUserDispatch(): UserContextDispatch {
  const context = React.useContext(UserDispatchContext);

  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider.');
  }

  return context;
}

function useUserContext(): [UserProviderState, UserContextDispatch] {
  return [useUserState(), useUserDispatch()];
}

export { UserProvider, useUserState, useUserDispatch, useUserContext };
