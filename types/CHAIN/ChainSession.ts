import { StepAttempt } from './StepAttempt';

export enum ChainSessionType {
  'training' = 'Training',
  'probe' = 'Probe',
  'booster' = 'Booster',
}

export interface ChainSession {
  id?: number;
  last_updated?: Date;
  time_on_task_ms?: number;
  date?: Date;
  completed?: boolean;
  session_type?: ChainSessionType;
  step_attempts: StepAttempt[];
}
