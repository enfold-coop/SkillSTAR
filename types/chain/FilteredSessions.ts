import { ChainSession } from './ChainSession';

export interface SessionAndIndex {
  session: ChainSession;
  session_index: number;
}

export type SessionGroup = SessionAndIndex[];

export interface SessionGroups {
  probeSessionGroups: SessionGroup[];
  trainingSessionGroups: SessionGroup[];
  challengingSessionGroups: SessionGroup[];
}
