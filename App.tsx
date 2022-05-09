import { NavigationContainer, NavigationContainerRef, ParamListBase } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { loadAsync } from 'expo-font';
import React, { createRef, ReactElement, useEffect, useState } from 'react';
import { Button, Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ConfirmExitSession } from './components/ConfirmExitSession/ConfirmExitSession';
import { Empty } from './components/Empty/Empty';
import { Loading } from './components/Loading/Loading';
import { SelectParticipant } from './components/SelectParticipant/SelectParticipant';
import { ChainMasteryProvider } from './context/ChainMasteryProvider';
import { ParticipantProvider } from './context/ParticipantProvider';
import { UserProvider } from './context/UserProvider';
import BaselineAssessmentScreen from './screens/BaselineAssessmentScreen';
import ChainsHomeScreen from './screens/ChainsHomeScreen';
import DataVerificationScreen from './screens/DataVerificationScreen';
import LandingScreen from './screens/LandingScreen';
import NoQuestionnaireScreen from './screens/NoQuestionnaireScreen';
import PrepareMaterialsScreen from './screens/PrepareMaterialsScreen';
import RewardsScreens from './screens/RewardsScreens';
import StepScreen from './screens/StepScreen';
import { ApiService } from './services/ApiService';
import CustomColors from './styles/Colors';
import { customFonts } from './styles/Fonts';
import { globalTheme } from './styles/Global';
import { RootStackParamList, screenOpts } from './types/NavigationOptions';

const containerRef = createRef<NavigationContainerRef<RootStackParamList>>();
const Stack = createStackNavigator<RootStackParamList>();

/**
 * Entry for the application.
 */
export default function App(): JSX.Element | null {
  const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);

  useEffect(() => {
    // Prevents React state updates on unmounted components
    let isCancelled = false;

    const _loadFonts = async () => {
      await loadAsync(customFonts);

      if (!isCancelled) {
        setIsLoadingComplete(true);
      }
    };

    if (!isCancelled) {
      _loadFonts().catch((e) => {
        console.error(e);
      });
    }

    return () => {
      isCancelled = true;
    };
  });

  interface NavButtonProps {
    navigation: StackNavigationProp<ParamListBase>;
  }

  const SelectParticipantButton = (props: NavButtonProps): ReactElement => {
    return (
      <Button
        color={CustomColors.uva.white}
        labelStyle={{ fontSize: 16, textTransform: 'capitalize' }}
        onPress={() => {
          props.navigation.navigate('SelectParticipant');
        }}
      >{`Change Participant`}</Button>
    );
  };

  const LogoutButton = (props: NavButtonProps): ReactElement => {
    return (
      <Button
        color={CustomColors.uva.white}
        onPress={() => {
          ApiService.logout(() => {
            props.navigation.navigate('LandingScreen');
          });
        }}
      >{`Logout`}</Button>
    );
  };

  const getHeaderLeftFunc = (): (() => JSX.Element) => {
    return function headerLeftFunc() {
      return <Empty />;
    };
  };

  const getHeaderRightFunc = (
    navigation: StackNavigationProp<ParamListBase>,
    parentScreen?: string,
  ): (() => JSX.Element) => {
    return function headerRightFunc() {
      if (parentScreen === 'ChainsHomeScreen') {
        return <SelectParticipantButton navigation={navigation} />;
      }

      if (parentScreen === 'SelectParticipant') {
        return <LogoutButton navigation={navigation} />;
      }

      if (['PrepareMaterialsScreen', 'StepScreen'].includes(`${parentScreen}`)) {
        return <ConfirmExitSession />;
      }

      return <Empty />;
    };
  };

  const Navigation = (): JSX.Element => (
    <NavigationContainer ref={containerRef}>
      <Stack.Navigator initialRouteName={'LandingScreen'}>
        <Stack.Screen name={'LandingScreen'} component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen
          options={({ route, navigation }) => ({
            ...screenOpts,
            title: 'Select Participant',
          })}
          name={'SelectParticipant'}
          component={SelectParticipant}
        />
        <Stack.Screen
          options={({ route, navigation }) => ({
            ...screenOpts,
            title: 'Chains',
            headerRight: getHeaderRightFunc(navigation, 'ChainsHomeScreen'),
          })}
          name={'ChainsHomeScreen'}
          component={ChainsHomeScreen}
        />
        <Stack.Screen
          options={({ route, navigation }) => ({
            ...screenOpts,
            title: 'Prepare Materials',
            headerLeft: getHeaderLeftFunc(),
            headerRight: getHeaderRightFunc(navigation, 'PrepareMaterialsScreen'),
          })}
          name={'PrepareMaterialsScreen'}
          component={PrepareMaterialsScreen}
        />
        <Stack.Screen
          options={({ route, navigation }) => ({
            ...screenOpts,
            title: 'Baseline Assessment',
            headerRight: getHeaderRightFunc(navigation),
          })}
          name={'BaselineAssessmentScreen'}
          component={BaselineAssessmentScreen}
        />
        <Stack.Screen
          options={({ route, navigation }) => ({
            ...screenOpts,
            title: 'Data verification',
          })}
          name={'DataVerificationScreen'}
          component={DataVerificationScreen}
        />
        <Stack.Screen
          options={({ route, navigation }) => ({
            ...screenOpts,
            title: 'Step',
            headerLeft: getHeaderLeftFunc(),
            headerRight: getHeaderRightFunc(navigation, 'StepScreen'),
          })}
          name={'StepScreen'}
          component={StepScreen}
        />
        <Stack.Screen
          options={({ route, navigation }) => ({
            ...screenOpts,
            title: 'Congrats!',
          })}
          name={'RewardsScreens'}
          component={RewardsScreens}
        />
        <Stack.Screen
          options={({ route, navigation }) => ({
            ...screenOpts,
            title: 'No SkillSTAR Data for this participant',
            headerRight: getHeaderRightFunc(navigation),
          })}
          name={'NoQuestionnaireScreen'}
          component={NoQuestionnaireScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  return isLoadingComplete ? (
    <SafeAreaProvider>
      <Provider theme={globalTheme}>
        <UserProvider>
          <ParticipantProvider>
            <ChainMasteryProvider>
              <Navigation />
            </ChainMasteryProvider>
          </ParticipantProvider>
        </UserProvider>
      </Provider>
    </SafeAreaProvider>
  ) : (
    <Loading />
  );
}
