import { ChainStepPromptLevel, ChainStepStatus } from './StepAttempt';

export interface MasteryInfo {
  chainStepId: number;
  stepStatus: ChainStepStatus;
  dateIntroduced?: Date;
  dateMastered?: Date;
  dateBoosterInitiated?: Date;
  dateBoosterMastered?: Date;
  numAttemptsSince: MasteryInfoNumAttemptsSince;
  promptLevel?: ChainStepPromptLevel;
}

export interface MasteryInfoNumAttemptsSince {
  firstIntroduced: number;
  firstCompleted: number;
  lastCompleted: number;
  lastCompletedWithoutChallenge: number;
  lastCompletedWithoutPrompt: number;
  lastFailed: number;
  lastProbe: number;
  lastTraining: number;
  firstMastered: number;
  boosterInitiated: number;
  boosterLastAttempted: number;
  boosterMastered: number;
}

export interface MasteryInfoMap {
  [key: string]: MasteryInfo;
}
