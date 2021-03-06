import { ChainSession } from '../types/chain/ChainSession';
import { SessionAndIndex } from '../types/chain/FilteredSessions';
import { StepAttempt } from '../types/chain/StepAttempt';

export interface SessionPercentage {
  session_number: number;
  challenging_behavior?: number;
  mastery?: number;
}

function percentMastered(steps: StepAttempt[]) {
  const numMastered = steps.reduce((memo, step) => {
    return step.completed && !step.had_challenging_behavior ? memo + 1 : memo;
  }, 0);
  return (numMastered / steps.length) * 100;
}

function percentChallengingBehavior(steps: StepAttempt[]) {
  const numChallenging = steps.reduce((memo, step) => {
    return step.had_challenging_behavior ? memo + 1 : memo;
  }, 0);
  return (numChallenging / steps.length) * 100;
}

export function calculatePercentChallengingBehavior(sessions: ChainSession[]): SessionPercentage[] {
  return sessions.map((session, i) => {
    return { session_number: i + 1, challenging_behavior: percentChallengingBehavior(session.step_attempts) };
  });
}

export function calculatePercentMastery(sessions: SessionAndIndex[]): SessionPercentage[] {
  return sessions.map((item) => {
    const mastery = percentMastered(item.session.step_attempts);
    return { session_number: item.session_index + 1, mastery: mastery };
  });
}
