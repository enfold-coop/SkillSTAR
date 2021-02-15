import { ChainSession } from '../types/chain/ChainSession';
import { SessionAndIndex } from '../types/chain/FilteredSessions';
import { ChainStepPromptLevel, ChainStepStatus, StepAttempt } from '../types/chain/StepAttempt';

function percentMastered(steps: StepAttempt[]) {
  let r = 0;
  steps.forEach((e) => {
    if (e.completed && !e.had_challenging_behavior) {
      r++;
    }
  });
  return (r / steps.length) * 100;
}

function percentChalBehavior(steps: StepAttempt[]) {
  let r = 0;
  steps.forEach((e) => {
    if (e.had_challenging_behavior) {
      r++;
    }
  });
  return (r / steps.length) * 100;
}

export function CalcChalBehaviorPercentage(sessionArr: ChainSession[]) {
  if (sessionArr.length > 0) {
    return sessionArr.map((e, i) => {
      return { session_number: i + 1, challenging_behavior: percentChalBehavior(e.step_attempts) };
    });
  }
}

export function CalcMasteryPercentage(sessionArr: SessionAndIndex[]) {
  if (sessionArr.length > 0) {
    return sessionArr.map((e, i) => {
      return { session_number: e.session_index + 1, mastery: percentMastered(e.session?.step_attempts) };
    });
  }
}
