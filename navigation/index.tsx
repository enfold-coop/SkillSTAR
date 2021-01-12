import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { ReactElement } from 'react';
import { ColorSchemeName } from 'react-native';
import { Button } from 'react-native-paper';
import {
  BaselineAssessmentScreen,
  ChainsHomeScreen,
  DataVerificationScreen,
  LandingScreen,
  NoQuestionnaireScreen,
  PrepareMaterialsScreen,
  ProbeScreen,
  RewardsScreens,
  StepScreen,
} from '../screens';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { screenOpts } from '../types/NavigationOptions';
import { RootStackParamList } from './root_types';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

interface LogoutButtonProps {
  navigation: StackNavigationProp<any>;
}

const LogoutButton = (props: LogoutButtonProps): ReactElement => {
  return (
    <Button
      color={CustomColors.uva.white}
      onPress={() => {
        ApiService.logout().then(() => {
          props.navigation.navigate('LandingScreen');
        });
      }}
    >
      Logout
    </Button>
  );
};

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='LandingScreen'
      // screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name='LandingScreen'
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...screenOpts,
          title: 'Chains', // TODO: Replace this title with something more useful
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
        name='ChainsHomeScreen'
        component={ChainsHomeScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...screenOpts,
          title: 'Prepare Materials',
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
        name='PrepareMaterialsScreen'
        component={PrepareMaterialsScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...screenOpts,
          title: 'Probe Session',
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
        name='ProbeScreen'
        component={ProbeScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...screenOpts,
          title: 'Baseline Assessment',
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
        name='BaselineAssessmentScreen'
        component={BaselineAssessmentScreen}
      />

      <Stack.Screen
        options={{ ...screenOpts, title: 'Data verification' }}
        name='DataVerificationScreen'
        component={DataVerificationScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...screenOpts,
          title: 'Step', // TODO: Replace this title with something more useful
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
        name='StepScreen'
        component={StepScreen}
      />
      <Stack.Screen
        options={{ ...screenOpts, title: 'Congrats!' }}
        name='RewardsScreens'
        component={RewardsScreens}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...screenOpts,
          title: 'No SkillSTAR Data for this participant', // TODO: Replace this title with something more useful
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
        name='NoQuestionnaireScreen'
        component={NoQuestionnaireScreen}
      />
    </Stack.Navigator>
  );
}
