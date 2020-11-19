import {NavigationContainer} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import * as React from "react";
import {ColorSchemeName, ImageBackground} from "react-native";
import LogoTitle from '../components/Header/LogoTitle';

import {
	LandingScreen,
	ChainsHomeScreen,
	BaselineAssessmentScreen,
	PrepareMaterialsScreen,
	StepScreen,
} from "../screens";
import CustomColors from "../styles/Colors";
import {screenOpts} from '../types/NavigationOptions';

import {RootStackParamList} from "./root_types";

export default function Navigation({colorScheme,}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer>
      <RootNavigator/>
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="LandingScreen"
      screenOptions={{headerShown: true}}
    >
      <Stack.Screen
        options={{...screenOpts, title: "Welcome"}}
        name="LandingScreen"
        component={LandingScreen}
      />
      <Stack.Screen
        options={{...screenOpts, title: "Baseline Assessment"}}
        name="BaselineAssessmentScreen"
        component={BaselineAssessmentScreen}
      />
      {/* <Stack.Screen
				options={{...screenOpts, title: "Skills"}}
				name="SkillsHomeScreen"
				component={SkillsHomeScreen}
			/> */}
      <Stack.Screen
        options={{...screenOpts, title: "Chains"}}
        name="ChainsHomeScreen"
        component={ChainsHomeScreen}
      />
      <Stack.Screen
        options={{...screenOpts, title: "Prepare Materials"}}
        name="PrepareMaterialsScreen"
        component={PrepareMaterialsScreen}
      />
      <Stack.Screen
        options={{...screenOpts, title: "Step"}}
        name="StepScreen"
        component={StepScreen}
      />
    </Stack.Navigator>
  );
}
