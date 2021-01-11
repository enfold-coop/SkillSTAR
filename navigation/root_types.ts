import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  LandingScreen: undefined;
  BaselineAssessmentScreen: undefined;
  ChainsHomeScreen: undefined;
  PrepareMaterialsScreen: undefined;
  StepScreen: undefined;
  ProbeScreen: undefined;
  DataVerificationScreen: undefined;
  RewardsScreens: undefined;
  NoQuestionnaireScreen: undefined;
};

// A generic used to provide propTypes to Root Screens.
export type RootNavProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};
