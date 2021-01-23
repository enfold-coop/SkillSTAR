import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { FilteredSessions } from '../types/chain/FilteredSessions';

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
