import { ChainMastery } from '../services/ChainMastery';
import { ChainSession } from '../types/chain/ChainSession';
import { SessionAndIndex } from '../types/chain/FilteredSessions';
import { ChainStepPromptLevelMap, StepAttempt } from '../types/chain/StepAttempt';

export interface SessionPercentage {
  session_number: number;
  challenging_behavior?: number;
  mastery?: number;
}

const promptLevelWeights: { [key: string]: number } = {};
Object.values(ChainStepPromptLevelMap)
  .reverse()
  .forEach((promptLevel, i) => {
    promptLevelWeights[promptLevel.key as string] = i;
  });

const percentMastered = (steps: StepAttempt[]): number => {
  const numMastered = steps.reduce((memo, step) => {
    const weight = promptLevelWeights[step.target_prompt_level as string];
    return ChainMastery.stepIsComplete(step) ? memo + weight : memo;
  }, 0);
  return (numMastered / steps.length) * 100;
};

const percentChallengingBehavior = (steps: StepAttempt[]): number => {
  const numChallenging = steps.reduce((memo, step) => {
    return step.had_challenging_behavior ? memo + 1 : memo;
  }, 0);
  return (numChallenging / steps.length) * 100;
};

export const calculatePercentChallengingBehavior = (sessions: ChainSession[]): SessionPercentage[] => {
  return sessions.map((session, i) => {
    return { session_number: i + 1, challenging_behavior: percentChallengingBehavior(session.step_attempts) };
  });
};

export const calculatePercentMastery = (sessions: SessionAndIndex[]): SessionPercentage[] => {
  return sessions.map((item) => {
    const mastery = percentMastered(item.session.step_attempts);
    return { session_number: item.session_index + 1, mastery: mastery };
  });
};
