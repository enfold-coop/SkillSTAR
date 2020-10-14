import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Landing: undefined;
  SkillsHome: undefined;
  NotFound: undefined;
  
};

export type LandingProps = StackScreenProps<RootStackParamList, 'Landing'>;
export type SkillHomeProps = StackScreenProps<RootStackParamList, 'SkillsHome'>;
