import { ChainMastery } from '../services/ChainMastery';
import { ChainData, SkillstarChain } from './chain/ChainData';
import { ChainSession } from './chain/ChainSession';
import { ChainStep } from './chain/ChainStep';
import { MasteryInfo } from './chain/MasteryLevel';
import { Participant, User } from './User';

export type ContextStateValue =
  | any
  | ChainStep[]
  | string
  | ChainSession
  | SkillstarChain
  | number
  | User
  | Participant
  | ChainData
  | MasteryInfo
  | boolean;

export type ContextDispatchAction =
  | { type: 'state'; payload: any }
  | { type: 'chainMastery'; payload: ChainMastery }
  | { type: 'chainSteps'; payload: ChainStep[] }
  | { type: 'sessionType'; payload: string }
  | { type: 'session'; payload: ChainSession }
  | { type: 'userData'; payload: SkillstarChain }
  | { type: 'sessionNumber'; payload: number }
  | { type: 'user'; payload: User }
  | { type: 'participant'; payload: Participant }
  | { type: 'chainData'; payload: ChainData }
  | { type: 'masteryInfo'; payload: MasteryInfo }
  | { type: 'isLoading'; payload: boolean };

export type ContextDispatch = (action: ContextDispatchAction) => void;

export type ChainProviderProps = { children: React.ReactNode };

export type ChainProviderState = {
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
  isLoading: boolean;
};
