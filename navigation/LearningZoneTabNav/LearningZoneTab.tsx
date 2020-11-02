// import { RouteProp } from "@react-navigation/native";
// import { NavigationContainer } from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {ReactElement} from 'react';
import * as React from "react";
import {ChainStackParamList} from '../../_types/Chain';
import {TipsTricksScreen} from '../../screens/TipsTricksScreen';

const TabStack = createBottomTabNavigator<ChainStackParamList>();

export const LearningZoneTabNav = (): ReactElement => {
	return (
		<TabStack.Navigator initialRouteName="TipsTricksScreen">
			<TabStack.Screen
				name="TipsTricksScreen"
				component={TipsTricksScreen}
			/>
		</TabStack.Navigator>
	);
}
