import { loadPartialConfig } from '@babel/core';
import { ChainSession } from '../types/chain/ChainSession';
import { ChainStepPromptLevel, ChainStepStatus, StepAttempt } from '../types/chain/StepAttempt';

function hadChalBehavior(step: StepAttempt): boolean | undefined {
  if (step.had_challenging_behavior) {
    return step.had_challenging_behavior;
  }
  return false;
}

function wasMastered(step: StepAttempt) {
  if (step && step.prompt_level === ChainStepPromptLevel.none) {
    return true;
  }
  return false;
}

function percentMastered(stepsMastered: number, stepCount: number) {
  return (stepsMastered / stepCount) * 100;
}

export function CalcMasteryPercentage(sessionArr: ChainSession[]) {
  const data = [];

  for (let i = 0; i < sessionArr.length; i++) {
    let count = 0;
    for (let j = 0; j < sessionArr[i].step_attempts.length; j++) {
      const f = sessionArr[i].step_attempts[j];
      const sessionDate = sessionArr[i].date;
      if (f.status === ChainStepStatus.focus) {
        if (!hadChalBehavior(f) && wasMastered(f)) {
          count++;
          const percMastered = percentMastered(count, sessionArr[i].step_attempts.length);
        }
      }

      return { date: sessionDate, percentMastered: percentMastered };
    }
  }

  //   sessionArr.forEach((e) => {
  //     data = e.step_attempts.map((f) => {});
  //   });

  return;
}
