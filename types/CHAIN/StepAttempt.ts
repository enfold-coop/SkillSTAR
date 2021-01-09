import {convertEnumToMap} from '../../_util/ConvertEnumToMap';
import { ChainSessionType } from './ChainSession';
import { ChainStep } from './ChainStep';

export interface ChallengingBehavior {
  id?: number;
  last_updated?: Date;
  chain_session_step_id: number;
  time: Date;
}

export enum ChainStepStatus {
  'not_complete' = 'Not complete',
  'focus' = 'Focus',
  'mastered' = 'Mastered',
}

export const ChainStepStatusMap = convertEnumToMap(ChainStepStatus);

export enum ChainStepPromptLevel {
  'none' = 'No Prompt (Independent)',
  'shadow' = 'Shadow Prompt (approximately one inch)',
  'partial_physical' = 'Partial Physical Prompt (thumb and index finger)',
  'full_physical' = 'Full Physical Prompt (hand-over-hand)',
}

export const ChainStepPromptLevelMap = convertEnumToMap(ChainStepPromptLevel);

export enum ChallengingBehaviorSeverity {
  'mild' = 'Mild (did not interfere with task)',
  'moderate' = 'Moderate (interfered with task, but we were able to work through it)',
  'severe' = 'Severe (we were not able to complete the task due to the severity of the behavior)',
}

export const ChallengingBehaviorSeverityMap = convertEnumToMap(ChallengingBehaviorSeverity);

export interface StepAttempt {
  id?: number;
  last_updated?: Date;
  chain_step_id?: number;
  chain_step?: ChainStep;
  date?: Date;
  status: ChainStepStatus;
  completed: boolean;
  was_prompted?: boolean;
  prompt_level?: ChainStepPromptLevel;
  had_challenging_behavior?: boolean;
  challenging_behavior_severity?: ChallengingBehaviorSeverity;
  challenging_behaviors?: ChallengingBehavior[];
  session_type?: ChainSessionType;
}
