import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ChainProvider } from "../../context/ChainProvider";
import { ChainStackParamList } from "./types";
import {
	ChainsHomeScreen,
	PrepareMaterialsScreen,
	StepScreen,
} from "../../screens/index";

export const ChainStack = createStackNavigator<ChainStackParamList>();

export function ChainNavigator() {
	return (
		<ChainStack.Navigator
			initialRouteName="ChainsHomeScreen"
			screenOptions={{ headerShown: false }}
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
