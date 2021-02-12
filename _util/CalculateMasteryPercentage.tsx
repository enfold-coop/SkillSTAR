import { ChainSession } from '../types/chain/ChainSession';
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

function percentChalBehavior() {
  //
}

export function CalcMasteryPercentage(sessionArr: ChainSession[]) {
  if (sessionArr.length > 0) {
    return sessionArr.map((e) => {
      return { sessionNumber: e.id, mastery: percentMastered(e.step_attempts) };
    });
  }
}
