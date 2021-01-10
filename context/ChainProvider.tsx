import React, { createContext, useReducer } from 'react';
import { ChainSession, ChainSessionType } from '../types/CHAIN/ChainSession';
import { ChainStep } from '../types/CHAIN/ChainStep';
import { MasteryInfo } from '../types/CHAIN/MasteryLevel';
import { ChainData, SkillstarChain } from '../types/CHAIN/SkillstarChain';
import { Participant, User } from '../types/User';

type Action =
  | { type: 'state'; payload: any }
  | { type: 'chainSteps'; payload: ChainStep[] }
  | { type: 'sessionType'; payload: string }
  | { type: 'session'; payload: ChainSession }
  | { type: 'userData'; payload: SkillstarChain }
  | { type: 'sessionNumber'; payload: number }
  | { type: 'user'; payload: User }
  | { type: 'participant'; payload: Participant }
  | { type: 'chainData'; payload: ChainData }
  | { type: 'masteryInfo'; payload: MasteryInfo };

type Dispatch = (action: Action) => void;

type ChainProviderProps = { children: React.ReactNode };
type ChainProviderState = {
  state?: any;
  dispatch?: any;
  chainSteps?: ChainStep[];
  sessionType?: string;
  session?: ChainSession;
  userData?: SkillstarChain;
  sessionNumber?: number;
  user?: User;
  participant?: Participant;
  chainData?: ChainData;
  masteryInfo?: MasteryInfo;
};

const initialState: ChainProviderState = {
  sessionType: ChainSessionType.probe,
  sessionNumber: 0,
};

const ChainStateContext = createContext<ChainProviderState | undefined>(undefined);
const ChainDispatchContext = createContext<Dispatch | undefined>(undefined);
const reducer = (state: any, action: Action) => {
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

function useChainContext(): [ChainProviderState, Dispatch] {
  return [useChainState(), useChainDispatch()];
}

export { ChainProvider, useChainState, useChainDispatch, useChainContext };
/**
 * - initialize Session Context Provider
 * - setting/getting state in Context API
 *
 */
