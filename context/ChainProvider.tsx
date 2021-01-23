import React, { createContext, useReducer } from 'react';
import { ChainSessionType } from '../types/CHAIN/ChainSession';
import { ChainProviderProps, ChainProviderState, ContextDispatch, ContextDispatchAction } from '../types/Context';

const initialState: ChainProviderState = {
  isLoading: true,
  sessionType: ChainSessionType.probe,
  sessionNumber: 0,
};

const ChainStateContext = createContext<ChainProviderState | undefined>(undefined);
const ChainDispatchContext = createContext<ContextDispatch | undefined>(undefined);
const reducer = (state: any, action: ContextDispatchAction) => {
  const actionType = action.type;

  switch (actionType) {
    case 'state':
      return { ...state, state: action.payload };
    case 'chainSteps':
      return { ...state, chainSteps: action.payload };
    case 'sessionType':
      return { ...state, sessionType: action.payload };
    case 'session':
      return { ...state, session: action.payload };
    case 'sessionNumber':
      return { ...state, sessionNumber: action.payload };
    case 'user':
      return { ...state, user: action.payload };
    case 'participant':
      return { ...state, participant: action.payload };
    case 'chainData':
      return { ...state, chainData: action.payload };
    case 'masteryInfo':
      return { ...state, masteryInfo: action.payload };
    case 'isLoading':
      return { ...state, isLoading: action.payload };
    default:
      throw new Error(`Unhandled action type: ${actionType}`);
  }
};

const ChainProvider = ({ children }: ChainProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ChainStateContext.Provider value={state}>
      <ChainDispatchContext.Provider value={dispatch}>{children}</ChainDispatchContext.Provider>
    </ChainStateContext.Provider>
  );
};

function useChainState() {
  const context = React.useContext(ChainStateContext);

  if (context === undefined) {
    throw new Error('useChainState must be used within a ChainProvider.');
  }

  return context;
}

function useChainDispatch() {
  const context = React.useContext(ChainDispatchContext);

  if (context === undefined) {
    throw new Error('useChainDispatch must be used within a ChainProvider.');
  }

  return context;
}

function useChainContext(): [ChainProviderState, ContextDispatch] {
  return [useChainState(), useChainDispatch()];
}

export { ChainProvider, useChainState, useChainDispatch, useChainContext };
/**
 * - initialize Session Context Provider
 * - setting/getting state in Context API
 *
 */
