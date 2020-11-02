import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";

export type TabNavParamList = {
	TipsTricksScreen: undefined;
};

export type TabNavProps<T extends keyof TabNavParamList> = {
	navigation: BottomTabNavigationProp<TabNavParamList, T>;
	route: RouteProp<TabNavParamList, T>;
};
