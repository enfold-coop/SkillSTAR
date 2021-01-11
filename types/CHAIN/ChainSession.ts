import { convertEnumToMap } from '../../_util/ConvertEnumToMap';
import { StepAttempt } from './StepAttempt';

export enum ChainSessionType {
  'training' = 'training',
  'probe' = 'probe',
  'booster' = 'booster',
}

export enum ChainSessionTypeLabels {
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

export const ChainSessionTypeMap = convertEnumToMap(ChainSessionType, ChainSessionTypeLabels);
