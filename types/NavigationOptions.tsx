import { RouteProp } from '@react-navigation/native';
import { StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack';
import CustomColors from '../styles/Colors';

export const screenOpts: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: CustomColors.uva.mountain,
  },
  headerTintColor: CustomColors.uva.white,
  headerTitleStyle: {
    fontWeight: 'bold',
    color: '#fff',
  },
};

export type RootStackParamList = {
  LandingScreen: undefined;
  SelectParticipant: undefined;
  BaselineAssessmentScreen: undefined;
  ChainsHomeScreen: undefined;
  PrepareMaterialsScreen: undefined;
  StepScreen: undefined;
  ProbeScreen: undefined;
  DataVerificationScreen: undefined;
  RewardsScreens: undefined;
  NoQuestionnaireScreen: undefined;
};
