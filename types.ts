import { StackScreenProps, StackNavigationProp } from "@react-navigation/stack";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
	Landing: undefined;
	SkillsHome: undefined;
	SkillScreen: undefined;
};

export type RootNavProps<T extends keyof RootStackParamList> = {
	navigation: StackNavigationProp<RootStackParamList, T>;
	route: RouteProp<RootStackParamList, T>;
};
