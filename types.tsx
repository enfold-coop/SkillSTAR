import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Landing: undefined;
  SkillsHome: undefined;
  SkillScreen: undefined;
};

export type LandingProps = StackScreenProps<RootStackParamList, 'Landing'>;
export type SkillHomeProps = StackScreenProps<RootStackParamList, 'SkillsHome'>;
export type SkillScreenProps = StackScreenProps<RootStackParamList, 'SkillScreen'>;
