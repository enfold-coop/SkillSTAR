import { NavigationContainer } from "@react-navigation/native";
import {createStackNavigator, StackNavigationProp} from "@react-navigation/stack";
import {ReactElement} from 'react';
import * as React from "react";
import {Button, ColorSchemeName, View} from "react-native";

import {
	BaselineAssessmentScreen,
	ChainsHomeScreen,
	LandingScreen,
	PrepareMaterialsScreen,
	StepScreen,
	ProbeScreen,
	DataVerificationScreen,
} from "../screens";
import {ApiService} from '../services/ApiService';
import CustomColors from '../styles/Colors';
import {globalStyles} from '../styles/Global';
import { screenOpts } from "../types/NavigationOptions";
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

const api = new ApiService();

interface LogoutButtonProps {
	navigation: StackNavigationProp<any>
}

const LogoutButton = (props: LogoutButtonProps): ReactElement => (
	<View style={globalStyles.container}>
		<Button
			title="Logout"
			color={CustomColors.uva.blue}
			onPress={() => {
				api.logout().then(() => {
					props.navigation.navigate("LandingScreen");
				});
			}}
		/>
	</View>
)

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator
			initialRouteName="LandingScreen"
			screenOptions={{ headerShown: true }}
		>
			<Stack.Screen
				options={{ ...screenOpts, title: "Welcome" }}
				name="LandingScreen"
				component={LandingScreen}
			/>
			<Stack.Screen
				options={({navigation}) => ({
					...screenOpts,
					title: "Probe Session",
					headerRight: () => (<LogoutButton navigation={navigation}/>)
				})}
				name="ProbeScreen"
				component={ProbeScreen}
			/>
			<Stack.Screen
				options={({navigation}) => ({
					...screenOpts,
					title: "Baseline Assessment",
					headerRight: () => (<LogoutButton navigation={navigation}/>)
				})}
				name="BaselineAssessmentScreen"
				component={BaselineAssessmentScreen}
			/>
			<Stack.Screen
				options={{ ...screenOpts, title: "Data verification" }}
				name="DataVerificationScreen"
				component={DataVerificationScreen}
			/>
			{/* <Stack.Screen
				options={{...screenOpts, title: "Skills"}}
				name="SkillsHomeScreen"
				component={SkillsHomeScreen}
			/> */}
			<Stack.Screen
				options={({navigation}) => ({
					...screenOpts,
					title: "Chains", // TODO: Replace this title with something more useful
					headerRight: () => (<LogoutButton navigation={navigation}/>)
				})}
				name="ChainsHomeScreen"
				component={ChainsHomeScreen}
			/>
			<Stack.Screen
				options={({navigation}) => ({
					...screenOpts,
					title: "Prepare Materials",
					headerRight: () => (<LogoutButton navigation={navigation}/>)
				})}
				name="PrepareMaterialsScreen"
				component={PrepareMaterialsScreen}
			/>
			<Stack.Screen
				options={({navigation}) => ({
					...screenOpts,
					title: "Step", // TODO: Replace this title with something more useful
					headerRight: () => (<LogoutButton navigation={navigation}/>)
				})}
				name="StepScreen"
				component={StepScreen}
			/>
		</Stack.Navigator>
	);
}
