import { NavigationContainer } from "@react-navigation/native";
import {
	createStackNavigator,
	StackNavigationOptions,
} from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import {
	LandingScreen,
	ChainsHomeScreen,
	SkillsHomeScreen,
	BaselineAssessmentScreen,
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
		<NavigationContainer>
			<RootNavigator />
		</NavigationContainer>
	);
}

const screenOpts: StackNavigationOptions = {
	headerStyle: {
		backgroundColor: CustomColors.uva.blue,
	},
	headerTintColor: CustomColors.uva.orange,
	headerTitleStyle: {
		fontWeight: "bold",
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
				options={screenOpts}
				name="LandingScreen"
				component={LandingScreen}
			/>
			<Stack.Screen
				options={screenOpts}
				name="BaselineAssessmentScreen"
				component={BaselineAssessmentScreen}
			/>
			{/* <Stack.Screen
				options={screenOpts}
				name="SkillsHomeScreen"
				component={SkillsHomeScreen}
			/> */}
			<Stack.Screen
				options={screenOpts}
				name="ChainsHomeScreen"
				component={ChainsHomeScreen}
			/>
			<Stack.Screen
				options={screenOpts}
				name="PrepareMaterialsScreen"
				component={PrepareMaterialsScreen}
			/>
			<Stack.Screen
				options={screenOpts}
				name="StepScreen"
				component={StepScreen}
			/>
		</Stack.Navigator>
	);
}
