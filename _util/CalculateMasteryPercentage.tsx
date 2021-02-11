import { loadPartialConfig } from '@babel/core';
import { ChainSession } from '../types/chain/ChainSession';
import { ChainStepPromptLevel, ChainStepStatus, StepAttempt } from '../types/chain/StepAttempt';

function hadChalBehavior(step: StepAttempt): boolean | undefined {
  if (step.had_challenging_behavior) {
    return step.had_challenging_behavior;
  }
  return false;
}

const i = 0;

function wasMastered(step: StepAttempt) {
  if (step && step.prompt_level === ChainStepPromptLevel.none) {
    return true;
  }
  return false;
}

function percentMastered(step: StepAttempt) {
  console.log('percent mastered placeholder to make linter happy');
}

export function CalcMasteryPercentage(sessionArr: ChainSession[]) {
  const data = [];
  const percentMastered = 0;
  sessionArr.forEach((e) => {
    e.step_attempts.map((f) => {
      if (f.status === ChainStepStatus.focus) {
        if (!hadChalBehavior(f) && wasMastered(f)) {
          const percent = percentMastered(f);
          data.push({ date: f.date });
        }
        return;
      }
    });
  });

  /**
   * 1. get focus step date,
   * 2. get focus step mastery:
   *   -- was focus step previously mastered?
   *   -- was focus step completed?
   *   -- was focus step completed independently?
   *   -- was focus step completed w/out chal behavior?
   * 3.
   *
   *
   * return [{date: --/--/----, mastery: --%}, {date: --/--/----, mastery: --%}, ...]
   */

  return;
}
