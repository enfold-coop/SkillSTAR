import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { FilteredSessionsWithSessionNumber, SessionAndIndex } from '../types/chain/FilteredSessions';

// Filters user session data by session type.
// RETURNS: 2 arrays, each containing session and session index;
export function FilteredSessionWithSessionIndex(data: ChainSession[]): FilteredSessionsWithSessionNumber {
  const probeArr: SessionAndIndex[] = [];
  const trainingArr: SessionAndIndex[] = [];

  if (data != undefined) {
    data.forEach((e, i) => {
      if (e != undefined) {
        if (e.session_type === ChainSessionType.probe) {
          const item = { session: e, session_index: i };
          probeArr.push(item);
        }
        if (e.session_type === ChainSessionType.training) {
          const item = { session: e, session_index: i };
          trainingArr.push(item);
        }
      }
    });
  }
  return { probeArr, trainingArr };
}
