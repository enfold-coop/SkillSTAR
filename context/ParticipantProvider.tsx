import React, { createContext, useReducer } from 'react';
import {
  ParticipantContextDispatch,
  ParticipantContextDispatchAction,
  ParticipantProviderProps,
  ParticipantProviderState,
} from '../types/ParticipantProvider';

const initialState: ParticipantProviderState = {
  participant: undefined,
};

const ParticipantStateContext = createContext<ParticipantProviderState | undefined>(undefined);
const ParticipantDispatchContext = createContext<ParticipantContextDispatch | undefined>(undefined);
const reducer = (state: any, action: ParticipantContextDispatchAction) => {
  const actionType = action.type;
  let newState;

  switch (actionType) {
    case 'participant':
      newState = { ...state, participant: action.payload };
      break;
    default:
      throw new Error(`Unhandled action type: ${actionType}`);
  }

  return newState;
};

const ParticipantProvider = ({ children }: ParticipantProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ParticipantStateContext.Provider value={state}>
      <ParticipantDispatchContext.Provider value={dispatch}>{children}</ParticipantDispatchContext.Provider>
    </ParticipantStateContext.Provider>
  );
};

function useParticipantState(): ParticipantProviderState {
  const context = React.useContext(ParticipantStateContext);

  if (context === undefined) {
    throw new Error('useChainState must be used within a ChainProvider.');
  }

  return context;
}

function useParticipantDispatch(): ParticipantContextDispatch {
  const context = React.useContext(ParticipantDispatchContext);

  if (context === undefined) {
    throw new Error('useParticipantDispatch must be used within a ParticipantProvider.');
  }

  return context;
}

function useParticipantContext(): [ParticipantProviderState, ParticipantContextDispatch] {
  return [useParticipantState(), useParticipantDispatch()];
}

export { ParticipantProvider, useParticipantState, useParticipantDispatch, useParticipantContext };
