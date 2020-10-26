import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type data = [
	{ name: string; subItems: [{ id: string; title: string; score: Number }] }
];
type dataItem = [
	{ name: string; subItems: [{ id: string; title: string; score: Number }] }
];

export type RootStackParamList = {
	LandingScreen: undefined;
	SkillsHomeScreen: undefined | { data: data; dataItem: dataItem };
	ChainsHomeScreen: undefined | { thisSkill: string; data: [] };
};

// A generic used to provide propTypes to Root Screens.
export type RootNavProps<T extends keyof RootStackParamList> = {
	navigation: StackNavigationProp<RootStackParamList, T>;
	route: RouteProp<RootStackParamList, T>;
};
