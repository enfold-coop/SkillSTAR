import * as React from "react";
import {} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ChainStackParamList } from "./types";
import {
	ChainsHomeScreen,
	PrepareMaterialsScreen,
	StepScreen,
} from "../../screens/index";

const ChainStack = createStackNavigator<ChainStackParamList>();

export function ChainNavigator() {
	return (
		<ChainStack.Navigator
			initialRouteName="ChainHomeScreen"
			screenOptions={{ headerShown: true }}
		>
			<ChainStack.Screen
				name="ChainsHomeScreen"
				component={ChainsHomeScreen}
			/>
			<ChainStack.Screen
				name="PrepareMaterialsScreen"
				component={PrepareMaterialsScreen}
			/>
			<ChainStack.Screen name="StepScreen" component={StepScreen} />
		</ChainStack.Navigator>
	);
}
