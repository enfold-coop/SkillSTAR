import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
	LandingScreen: undefined;
	BaselineAssessmentScreen: undefined;
	SkillsHomeScreen: undefined;
	ChainsHomeScreen: undefined;
	PrepareMaterialsScreen: undefined;
	StepScreen: undefined;
};

// A generic used to provide propTypes to Root Screens.
export type RootNavProps<T extends keyof RootStackParamList> = {
	navigation: StackNavigationProp<RootStackParamList, T>;
	route: RouteProp<RootStackParamList, T>;
};
