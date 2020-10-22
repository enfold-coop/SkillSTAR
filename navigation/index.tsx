import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import LandingScreen from "../screens/LandingScreen";
import SkillsHomeScreen from "../screens/ChainHomeScreen";
import { ScoreCardScreen } from "../screens/index";

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
			<Stack.Screen
				name="SkillsHomeScreen"
				component={SkillsHomeScreen}
			/>
			<Stack.Screen name="LandingScreen" component={LandingScreen} />
			<Stack.Screen name="ScoreCardScreen" component={ScoreCardScreen} />
		</Stack.Navigator>
	);
}
