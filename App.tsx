import { NavigationContainer, NavigationContainerRef, ParamListBase } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import * as Font from 'expo-font';
import React, { createRef, ReactElement, useEffect, useState } from 'react';
import { Button, Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Loading } from './components/Loading/Loading';
import {
  BaselineAssessmentScreen,
  ChainsHomeScreen,
  DataVerificationScreen,
  LandingScreen,
  NoQuestionnaireScreen,
  PrepareMaterialsScreen,
  RewardsScreens,
  StepScreen,
} from './screens';
import { ApiService } from './services/ApiService';
import CustomColors from './styles/Colors';
import { customFonts } from './styles/Fonts';
import { globalTheme } from './styles/Global';
import { RootStackParamList, screenOpts } from './types/NavigationOptions';

const containerRef = createRef<NavigationContainerRef>();
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
      await Font.loadAsync(customFonts);

      if (!isCancelled) {
        setIsLoadingComplete(true);
      }
    };

    if (!isCancelled) {
      _loadFonts().catch(e => {
        console.log(e);
      });
    }

    return () => {
      isCancelled = true;
    };
  });

  interface LogoutButtonProps {
    navigation: StackNavigationProp<ParamListBase>;
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

  const getHeaderRightFunc = (navigation: StackNavigationProp<any>): (() => JSX.Element) => {
    return function headerRightFunc() {
      return <LogoutButton navigation={navigation} />;
    };
  };

  const Navigation = (): JSX.Element => (
    <NavigationContainer ref={containerRef}>
      <Stack.Navigator initialRouteName={'LandingScreen'}>
        <Stack.Screen name={'LandingScreen'} component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen
          options={({ navigation }) => ({
            ...screenOpts,
            title: 'Chains', // TODO: Replace this title with something more useful
            headerRight: getHeaderRightFunc(navigation),
          })}
          name={'ChainsHomeScreen'}
          component={ChainsHomeScreen}
        />
        <Stack.Screen
          options={({ navigation }) => ({
            ...screenOpts,
            title: 'Prepare Materials',
            headerRight: getHeaderRightFunc(navigation),
          })}
          name={'PrepareMaterialsScreen'}
          component={PrepareMaterialsScreen}
        />
        {/* <Stack.Screen
          options={({ navigation }) => ({
            ...screenOpts,
            title: 'Probe Session',
            headerRight: getHeaderRightFunc(navigation,
          })}
          name={'ProbeScreen'}
          component={ProbeScreen}
        /> */}
        <Stack.Screen
          options={({ navigation }) => ({
            ...screenOpts,
            title: 'Baseline Assessment',
            headerRight: getHeaderRightFunc(navigation),
          })}
          name={'BaselineAssessmentScreen'}
          component={BaselineAssessmentScreen}
        />
        <Stack.Screen
          options={{ ...screenOpts, title: 'Data verification' }}
          name={'DataVerificationScreen'}
          component={DataVerificationScreen}
        />
        <Stack.Screen
          options={({ navigation }) => ({
            ...screenOpts,
            title: 'Step', // TODO: Replace this title with something more useful
            headerRight: getHeaderRightFunc(navigation),
          })}
          name={'StepScreen'}
          component={StepScreen}
        />
        <Stack.Screen
          options={{ ...screenOpts, title: 'Congrats!' }}
          name={'RewardsScreens'}
          component={RewardsScreens}
        />
        <Stack.Screen
          options={({ navigation }) => ({
            ...screenOpts,
            title: 'No SkillSTAR Data for this participant', // TODO: Replace this title with something more useful
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
        <Navigation />
      </Provider>
    </SafeAreaProvider>
  ) : (
    <Loading />
  );
}
