import {DarkTheme, DefaultTheme, NavigationContainer,} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import * as React from 'react';
import {ReactElement} from 'react';
import {ColorSchemeName} from "react-native";
import {RootStackParamList} from "../_types/RootNav";
import {ChainsHomeScreen} from '../screens/ChainsHomeScreen';
import {LandingScreen} from '../screens/LandingScreen';
import {SkillsHomeScreen} from '../screens/SkillsHomeScreen';

export const Navigation = ({colorScheme}: { colorScheme: ColorSchemeName; }): ReactElement => {
  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator/>
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = (): ReactElement => {
  return (
    <Stack.Navigator
      initialRouteName="SkillsHomeScreen"
      screenOptions={{headerShown: true}}
    >
      <Stack.Screen
        name="SkillsHomeScreen"
        component={SkillsHomeScreen}
      />
      <Stack.Screen
        name="LandingScreen"
        component={LandingScreen}
      />
      <Stack.Screen
        name="ChainsHomeScreen"
        component={ChainsHomeScreen}
      />
    </Stack.Navigator>
  );
}
