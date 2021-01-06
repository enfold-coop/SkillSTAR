import {ChainStepStatus} from './StepAttempt';

export interface MasteryStatus {
  stepStatus: ChainStepStatus;
  label: string;
  icon: string;
  color: string;
}

export interface MasteryInfo {
  chainStepId: number;
  stepStatus: ChainStepStatus;
  dateIntroduced?: Date;
  dateMastered?: Date;
  dateBoosterInitiated?: Date;
  dateBoosterMastered?: Date;
}
