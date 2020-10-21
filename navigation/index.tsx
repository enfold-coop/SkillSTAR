import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import Landing from "../screens/LandingScreen";
import SkillsHome from "../screens/SkillsHomeScreen";
import { ScoreCardScreen } from "../screens/index";

import { RootStackParamList } from "./rootStackPropTypes";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
	colorScheme,
}: {
	colorScheme: ColorSchemeName;
}) {
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
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
			initialRouteName="Landing"
			screenOptions={{ headerShown: true }}
		>
			<Stack.Screen name="SkillsHome" component={SkillsHome} />
			<Stack.Screen name="Landing" component={Landing} />
			<Stack.Screen name="ScoreCardScreen" component={ScoreCardScreen} />
		</Stack.Navigator>
	);
}
