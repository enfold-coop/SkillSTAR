import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { FilteredSessions, FilteredSessionsWithSessionNumber, SessionAndIndex } from '../types/chain/FilteredSessions';

// Filters user session data by session type.
// RETURNS: 2 arrays, each containing session and session index;
export function FilteredSessionWithSessionIndex(data: ChainSession[]): FilteredSessionsWithSessionNumber {
  const probeArr: SessionAndIndex[] = [];
  const trainingArr: SessionAndIndex[] = [];

  if (data != undefined) {
    data.forEach((e, i) => {
      if (e != undefined) {
        console.log(e.session_type);
        if (e.session_type === ChainSessionType.probe) {
          probeArr[i].session = e;
          probeArr[i].session_index = i;
        }
        if (e.session_type === ChainSessionType.training) {
          trainingArr[i].session = e;
          trainingArr[i].session_index = i;
        }
      }
    });
  }
  return { probeArr, trainingArr };
}

// Filters user session data by session type.
// RETURNS: 2 arrays
export function FilterSessionsByType(data: ChainSession[]): FilteredSessions {
  const probeArr: ChainSession[] = [];
  const trainingArr: ChainSession[] = [];
  if (data != undefined) {
    data.forEach((e, i) => {
      if (e.session_type === ChainSessionType.probe) {
        probeArr[i] = e;
      }
      if (e.session_type === ChainSessionType.training) {
        trainingArr[i] = e;
      }
    });
  }
  return { probeArr, trainingArr };
}
