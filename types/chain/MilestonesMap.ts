import { StepAttempt } from './StepAttempt';

export interface MilestonesMap {
  [key: string]: Milestones;
}

export interface Milestones {
  firstMasteredStep?: StepAttempt;
  firstBoosterStep?: StepAttempt;
  boosterMasteredStep?: StepAttempt;
}
