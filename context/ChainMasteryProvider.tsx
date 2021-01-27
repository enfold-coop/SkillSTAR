import React, { createContext, useReducer } from 'react';
import {
  ChainMasteryContextDispatch,
  ChainMasteryContextDispatchAction,
  ChainMasteryProviderProps,
  ChainMasteryProviderState,
} from '../types/ChainMasteryProvider';

const initialState: ChainMasteryProviderState = {
  chainMastery: undefined,
};

const ChainMasteryStateContext = createContext<ChainMasteryProviderState | undefined>(undefined);
const ChainMasteryDispatchContext = createContext<ChainMasteryContextDispatch | undefined>(undefined);
const reducer = (state: any, action: ChainMasteryContextDispatchAction) => {
  const actionType = action.type;
  let newState;

  switch (actionType) {
    case 'chainMastery':
      newState = { ...state, chainMastery: action.payload };
      break;
    default:
      throw new Error(`Unhandled action type: ${actionType}`);
  }

  return newState;
};

const ChainMasteryProvider = ({ children }: ChainMasteryProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ChainMasteryStateContext.Provider value={state}>
      <ChainMasteryDispatchContext.Provider value={dispatch}>{children}</ChainMasteryDispatchContext.Provider>
    </ChainMasteryStateContext.Provider>
  );
};

function useChainMasteryState(): ChainMasteryProviderState {
  const context = React.useContext(ChainMasteryStateContext);

  if (context === undefined) {
    throw new Error('useChainState must be used within a ChainProvider.');
  }

  return context;
}

function useChainMasteryDispatch(): ChainMasteryContextDispatch {
  const context = React.useContext(ChainMasteryDispatchContext);

  if (context === undefined) {
    throw new Error('useChainMasteryDispatch must be used within a ChainMasteryProvider.');
  }

  return context;
}

function useChainMasteryContext(): [ChainMasteryProviderState, ChainMasteryContextDispatch] {
  return [useChainMasteryState(), useChainMasteryDispatch()];
}

export { ChainMasteryProvider, useChainMasteryState, useChainMasteryDispatch, useChainMasteryContext };
