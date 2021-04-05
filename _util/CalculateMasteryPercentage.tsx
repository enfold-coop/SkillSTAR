import { ChainMastery } from '../services/ChainMastery';
import { SessionGroup } from '../types/chain/FilteredSessions';
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

export const calculatePercentChallengingBehavior = (sessionGroups: SessionGroup[]): SessionPercentage[][] => {
  if (!sessionGroups || sessionGroups.length === 0 || !sessionGroups[0] || sessionGroups[0].length === 0) {
    return [];
  }

  return sessionGroups.map((sessionGroup) => {
    return sessionGroup.map((item, i) => {
      return {
        session_number: item.session_index + 1,
        challenging_behavior: percentChallengingBehavior(item.session.step_attempts),
      };
    });
  });
};

export const calculatePercentMastery = (sessionGroups: SessionGroup[]): SessionPercentage[][] => {
  if (!sessionGroups || sessionGroups.length === 0 || !sessionGroups[0] || sessionGroups[0].length === 0) {
    return [];
  }

  return sessionGroups.map((sessionGroup) => {
    return sessionGroup.map((item) => {
      return {
        session_number: item.session_index + 1,
        mastery: percentMastered(item.session.step_attempts),
      };
    });
  });
};
