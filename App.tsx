import * as Font from 'expo-font';
import React, { createRef, ReactElement, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { customFonts } from './styles/Fonts';
import {
  NavigationContainer,
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import CustomColors from './styles/Colors';
import { ApiService } from './services/ApiService';
import { RootStackParamList } from './types/NavigationOptions';
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
} from './screens';
import { screenOpts } from './types/NavigationOptions';
import { View, StyleSheet } from 'react-native';
import { Loading } from './components/Loading/Loading';

const containerRef = createRef<NavigationContainerRef>();
const Stack = createStackNavigator<RootStackParamList>();

/**
 * Entry for the application.
 */
export default (): JSX.Element | null => {
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

  const Navigation = (): JSX.Element => (
    <NavigationContainer ref={containerRef}>
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
    </NavigationContainer>
  );

  return isLoadingComplete ? (
    <SafeAreaProvider>
      <Provider>
        <Navigation />
      </Provider>
    </SafeAreaProvider>
  ) : (
    <Loading />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 0,
    marginTop: 100,
  },
});
