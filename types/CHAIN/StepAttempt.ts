import { convertEnumToMap } from '../../_util/ConvertEnumToMap';
import { ChainSessionType } from './ChainSession';
import { ChainStep } from './ChainStep';

export interface ChallengingBehavior {
  id?: number;
  last_updated?: Date;
  chain_session_step_id: number;
  time: Date;
}

export enum ChainStepStatus {
  'not_complete' = 'not_complete',
  'focus' = 'focus',
  'mastered' = 'mastered',
}

export enum ChainStepStatusLabels {
  'not_complete' = 'Not complete',
  'focus' = 'Focus',
  'mastered' = 'Mastered',
}

export const ChainStepStatusMap = convertEnumToMap(ChainStepStatus, ChainStepStatusLabels);

export enum ChainStepPromptLevel {
  'none' = 'none',
  'shadow' = 'shadow',
  'partial_physical' = 'partial_physical',
  'full_physical' = 'full_physical',
}

export enum ChainStepPromptLevelLabels {
  'none' = 'No Prompt (Independent)',
  'shadow' = 'Shadow Prompt (approximately one inch)',
  'partial_physical' = 'Partial Physical Prompt (thumb and index finger)',
  'full_physical' = 'Full Physical Prompt (hand-over-hand)',
}

export const ChainStepPromptLevelMap = convertEnumToMap(
  ChainStepPromptLevel,
  ChainStepPromptLevelLabels,
);

export enum ChallengingBehaviorSeverity {
  'mild' = 'mild',
  'moderate' = 'moderate',
  'severe' = 'severe',
}

export enum ChallengingBehaviorSeverityLabels {
  'mild' = 'Mild (did not interfere with task)',
  'moderate' = 'Moderate (interfered with task, but we were able to work through it)',
  'severe' = 'Severe (we were not able to complete the task due to the severity of the behavior)',
}

export const ChallengingBehaviorSeverityMap = convertEnumToMap(
  ChallengingBehaviorSeverity,
  ChallengingBehaviorSeverityLabels,
);

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

export type StepAttemptField =
  | ChainSessionType
  | ChainStep
  | ChainStepPromptLevel
  | ChainStepStatus
  | ChallengingBehaviorSeverity
  | ChallengingBehavior[]
  | Date
  | boolean
  | number;
