import { AntDesignT } from '../icons/AntDesign';
import { FeatherT } from '../icons/Feather';
import { MaterialCommunityIconsT } from '../icons/MaterialCommunityIcons';
import { MaterialIconsT } from '../icons/MaterialIcons';
import { ChainStepStatus } from './StepAttempt';

export interface MasteryStatus {
  stepStatus: ChainStepStatus;
  label: string;
  icon: string | MaterialIconsT | MaterialCommunityIconsT | AntDesignT | FeatherT;
  iconLibrary: 'SkillStarIcons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'AntDesign' | 'Feather';
  color: string;
}
