import {
	NavigationContainer,
	CompositeNavigationProp,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import {
	LandingScreen,
	ChainsHomeScreen,
	SkillsHomeScreen,
	BaselineAssessmentScreen,
	BackgroundSurveyScreen,
	PrepareMaterialsScreen,
	StepScreen,
} from "../screens/index";

import { RootStackParamList } from "./root_types";

export default function Navigation({
	colorScheme,
}: {
	colorScheme: ColorSchemeName;
}) {
	return (
		<NavigationContainer
			theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<RootNavigator />
		</NavigationContainer>
	);
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator
			initialRouteName="LandingScreen"
			screenOptions={{ headerShown: true }}
		>
			<Stack.Screen name="LandingScreen" component={LandingScreen} />
			<Stack.Screen
				name="BackgroundSurveyScreen"
				component={BackgroundSurveyScreen}
			/>
			<Stack.Screen
				name="BaselineAssessmentScreen"
				component={BaselineAssessmentScreen}
			/>
			<Stack.Screen
				name="SkillsHomeScreen"
				component={SkillsHomeScreen}
			/>
			<Stack.Screen
				name="ChainsHomeScreen"
				component={ChainsHomeScreen}
			/>
			<Stack.Screen
				name="PrepareMaterialsScreen"
				component={PrepareMaterialsScreen}
			/>
			<Stack.Screen name="StepScreen" component={StepScreen} />
		</Stack.Navigator>
	);
}
