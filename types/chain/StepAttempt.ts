import { convertEnumToMap } from '../../_util/ConvertEnumToMap';
import { ChainSessionType } from './ChainSession';
import { ChainStep } from './ChainStep';

export interface ChallengingBehavior {
  id?: number;
  last_updated?: Date;
  chain_session_step_id?: number;
  time: Date;
}

export enum ChainStepStatus {
  'not_yet_started' = 'not_yet_started',
  'not_complete' = 'not_complete',
  'focus' = 'focus',
  'mastered' = 'mastered',
  'booster_needed' = 'booster_needed',
  'booster_mastered' = 'booster_mastered',
}

export enum ChainStepStatusLabels {
  'not_complete' = 'Not complete',
  'focus' = 'Focus',
  'mastered' = 'Mastered',
  'booster_needed' = 'Booster needed',
  'booster_mastered' = 'Booster mastered',
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

export interface ChainStepPromptLevelMapItem {
  order: number;
  key: ChainStepPromptLevel;
  value: ChainStepPromptLevelLabels;
}

export const ChainStepPromptLevelMap: { [key: string]: ChainStepPromptLevelMapItem } = {
  none: {
    order: 0,
    key: ChainStepPromptLevel.none,
    value: ChainStepPromptLevelLabels.none,
  },
  shadow: {
    order: 1,
    key: ChainStepPromptLevel.shadow,
    value: ChainStepPromptLevelLabels.shadow,
  },
  partial_physical: {
    order: 2,
    key: ChainStepPromptLevel.partial_physical,
    value: ChainStepPromptLevelLabels.partial_physical,
  },
  full_physical: {
    order: 3,
    key: ChainStepPromptLevel.full_physical,
    value: ChainStepPromptLevelLabels.full_physical,
  },
};

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

export enum StepIncompleteReason {
  'lack_of_attending' = 'lack_of_attending',
  'challenging_behavior' = 'challenging_behavior',
  'sensory_issues' = 'sensory_issues',
  'other' = 'other',
}

export enum StepIncompleteReasonLabels {
  'lack_of_attending' = 'Lack of Attending',
  'challenging_behavior' = 'Challenging Behavior',
  'sensory_issues' = 'Sensory Issues(materials are aversive)',
  'other' = 'Other',
}

export const StepIncompleteReasonMap = convertEnumToMap(StepIncompleteReason, StepIncompleteReasonLabels);

export interface StepAttempt {
  id?: number;
  last_updated?: Date;
  chain_step_id: number;
  chain_step?: ChainStep;
  date?: Date;
  status?: ChainStepStatus;
  completed?: boolean;
  was_prompted?: boolean;
  prompt_level?: ChainStepPromptLevel;
  had_challenging_behavior?: boolean;
  reason_step_incomplete?: StepIncompleteReason;
  challenging_behaviors?: ChallengingBehavior[];
  session_type?: ChainSessionType;

  // Focus steps
  was_focus_step?: boolean;
  target_prompt_level?: ChainStepPromptLevel;
}

// List of valid field names for the StepAttempt interface, which will keep us
// from accidentally misspelling the field name when we try to set the field
// for a specific step attempt.
export type StepAttemptFieldName =
  | 'id'
  | 'last_updated'
  | 'chain_step_id'
  | 'chain_step'
  | 'date'
  | 'status'
  | 'completed'
  | 'was_prompted'
  | 'prompt_level'
  | 'had_challenging_behavior'
  | 'reason_step_incomplete'
  | 'challenging_behaviors'
  | 'session_type'
  | 'was_focus_step'
  | 'target_prompt_level';

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
