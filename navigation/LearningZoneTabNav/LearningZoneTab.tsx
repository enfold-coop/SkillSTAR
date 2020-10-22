import * as React from "react";
import { RouteProp } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ChainStackParamList } from "./types";
import { TipsTricksScreen } from "../../screens/index";

const TabStack = createBottomTabNavigator<ChainStackParamList>();

export function LearningZoneTabNav() {
	return (
		<TabStack.Navigator initialRouteName="TipsTricksScreen">
			<TabStack.Screen
				name="TipsTricksScreen"
				component={TipsTricksScreen}
			/>
		</TabStack.Navigator>
	);
}

type TabNavParamList = {
	TipsTricksScreen: undefined;
};

interface TabNavProps {}

export type TabNavProps<T extends keyof TabNavParamList> = {
	navigation: TabNavProps<TabNavParamList, T>;
	route: RouteProp<TabNavParamList, T>;
};
