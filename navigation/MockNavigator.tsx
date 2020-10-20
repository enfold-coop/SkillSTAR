import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "../screens/Landing";
import SkillsHome from "../screens/SkillsHome";
import ScoreCardScreen from "../screens/Chain/ScoreCardScreen";

const Stack = createStackNavigator();
const MockedNavigator = ({ component, params = {} }) => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="MockedScreen"
					component={component}
					initialParams={params}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default MockedNavigator;
