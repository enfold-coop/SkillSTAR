import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { SessionGroup, SessionGroups } from '../types/chain/FilteredSessions';

// Filters user sessions by session type.
// RETURNS: 3 arrays, each containing session and session index;
export function FilteredSessionWithSessionIndex(sessions: ChainSession[]): SessionGroups {
  const probeSessions: SessionGroup[] = [];
  const trainingSessions: SessionGroup[] = [];
  const challengingSessions: SessionGroup[] = [];
  let lastProbeSessionIndex = -2;
  let lastTrainingSessionIndex = -2;

  if (sessions != undefined) {
    sessions.forEach((e, i) => {
      if (e != undefined) {
        const item = { session: e, session_index: i };

        if (e.session_type === ChainSessionType.probe) {
          // Break up probes into groups of 3
          if (i === lastProbeSessionIndex + 1) {
            // Add item to existing group
            probeSessions[probeSessions.length - 1].push(item);
            challengingSessions[challengingSessions.length - 1].push(item);
          } else {
            // Add item to a new group
            probeSessions.push([item]);
            challengingSessions.push([item]);
          }

          lastProbeSessionIndex = i;
        }
        if (e.session_type === ChainSessionType.training) {
          // Break up training sessions into groups of 12
          if (i === lastTrainingSessionIndex + 1) {
            // Add item to existing group
            trainingSessions[trainingSessions.length - 1].push(item);
            challengingSessions[challengingSessions.length - 1].push(item);
          } else {
            // Add item to a new group
            trainingSessions.push([item]);
            challengingSessions.push([item]);
          }

          lastTrainingSessionIndex = i;
        }
      }
    });
  }
  return {
    probeSessionGroups: probeSessions,
    trainingSessionGroups: trainingSessions,
    challengingSessionGroups: challengingSessions,
  };
}
