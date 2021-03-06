import { AntDesignT } from '../icons/AntDesign';
import { FeatherT } from '../icons/Feather';
import { MaterialCommunityIconsT } from '../icons/MaterialCommunityIcons';
import { MaterialIconsT } from '../icons/MaterialIcons';
import { ChainStepPromptLevel, ChainStepStatus, StepAttempt } from './StepAttempt';

export interface MasteryStatus {
  stepStatus: ChainStepStatus;
  label: string;
  icon: string | MaterialIconsT | MaterialCommunityIconsT | AntDesignT | FeatherT;
  iconLibrary: 'SkillStarIcons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'AntDesign' | 'Feather';
  color: string;
}

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
  firstMastered: number;
  boosterInitiated: number;
  boosterLastAttempted: number;
  boosterMastered: number;
}

export interface MasteryInfoMap {
  [key: string]: MasteryInfo;
}

export interface PromptLevelMap {
  targetPromptLevel?: ChainStepPromptLevel;
  firstMasteredStep?: StepAttempt;
  firstBoosterStep?: StepAttempt;
  boosterMasteredStep?: StepAttempt;
}
