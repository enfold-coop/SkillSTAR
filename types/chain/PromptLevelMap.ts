import { ChainStepPromptLevel } from './StepAttempt';

export interface PromptLevelMap {
  [key: string]: PromptLevel;
}

export interface PromptLevel {
  targetPromptLevel?: ChainStepPromptLevel;
}
