import { ChainSession } from './ChainSession';

export interface FilteredSessions {
  probeArr: ChainSession[];
  trainingArr: ChainSession[];
}

export interface SessionAndIndex {
  session: ChainSession;
  session_index: number;
}

export interface FilteredSessionsWithSessionNumber {
  probeArr: SessionAndIndex[];
  trainingArr: SessionAndIndex[];
}
