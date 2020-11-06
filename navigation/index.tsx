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
import CustomColors from "../styles/Colors";

import { RootStackParamList } from "./root_types";

export default function Navigation({
	colorScheme,
}: {
	colorScheme: ColorSchemeName;
}) {
	return (
		<NavigationContainer
		// theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<RootNavigator />
		</NavigationContainer>
	);
}

const headerStyles = {
	backgroundColor: CustomColors.uva.blue,
};

const options = {
	headerStyle: {
		backgroundColor: CustomColors.uva.blue,
	},
	headerTintColor: CustomColors.uva.orange,
	headerTitleStyle: {
		fontWeight: "bold",
		// headerTitle: "#fff",
		color: "#fff",
	},
};

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator
			initialRouteName="LandingScreen"
			screenOptions={{ headerShown: true }}
		>
			<Stack.Screen
				options={options}
				name="LandingScreen"
				component={LandingScreen}
			/>
			<Stack.Screen
				options={options}
				name="BaselineAssessmentScreen"
				component={BaselineAssessmentScreen}
			/>
			<Stack.Screen
				options={options}
				name="SkillsHomeScreen"
				component={SkillsHomeScreen}
			/>
			<Stack.Screen
				options={options}
				name="ChainsHomeScreen"
				component={ChainsHomeScreen}
			/>
			<Stack.Screen
				options={options}
				name="PrepareMaterialsScreen"
				component={PrepareMaterialsScreen}
			/>
			<Stack.Screen
				options={options}
				name="StepScreen"
				component={StepScreen}
			/>
		</Stack.Navigator>
	);
}
