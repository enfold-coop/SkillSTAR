import * as React from "react";
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { ChainStackParamList } from "./types";
import {
	BaselineAssessmentScreen,
	PrepareMaterialsScreen,
	ScoreCardScreen,
	Reward,
	StepScreen,
	TipsTricksScreen,
} from "../../screens/index";

export default function ChainNavigation({}) {
	return (
		<NavigationContainer>
			<ChainNavigator />
		</NavigationContainer>
	);
}

const ChainStack = createStackNavigator<ChainStackParamList>();

function ChainNavigator() {
	return (
		<ChainStack.Navigator
			initialRouteName="ChainHome"
			screenOptions={{ headerShown: true }}
		>
			<ChainStack.Screen
				name="PrepareMaterials"
				component={PrepareMaterialsScreen}
			/>
			<ChainStack.Screen
				name="ScoreCardScreen"
				component={ScoreCardScreen}
			/>
			<ChainStack.Screen
				name="BaselineAssessment"
				component={BaselineAssessmentScreen}
			/>
			<ChainStack.Screen name="Reward" component={Reward} />
			<ChainStack.Screen name="StepScreen" component={StepScreen} />
			<ChainStack.Screen name="Tipstricks" component={TipsTricksScreen} />
		</ChainStack.Navigator>
	);
}
