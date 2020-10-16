import * as React from "react";
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { ChainStackParamList } from "./types";
import {
	BaselineAssessment,
	PrepareMaterials,
	Reward,
	SkillScreen,
	StepScreen,
	Tipstricks,
} from "../../screens/Chain/index";

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
			initialRouteName="SkillScreen"
			screenOptions={{ headerShown: true }}
		>
			<ChainStack.Screen name="SkillScreen" component={SkillScreen} />
			<ChainStack.Screen
				name="PrepareMaterials"
				component={PrepareMaterials}
			/>
			<ChainStack.Screen
				name="BaselineAssessment"
				component={BaselineAssessment}
			/>
			<ChainStack.Screen name="Reward" component={Reward} />
			<ChainStack.Screen name="StepScreen" component={StepScreen} />
			<ChainStack.Screen name="Tipstricks" component={Tipstricks} />
		</ChainStack.Navigator>
	);
}
