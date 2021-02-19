import { ChainSession } from './ChainSession';

export interface FilteredSessions {
  probeArr: ChainSession[];
  trainingArr: ChainSession[];
}

export interface SessionAndIndex {
  session: ChainSession | undefined;
  session_index: number | undefined;
}

export interface FilteredSessionsWithSessionNumber {
  probeArr: SessionAndIndex[];
  trainingArr: SessionAndIndex[];
}
