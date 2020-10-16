import { StackScreenProps, StackNavigationProp } from "@react-navigation/stack";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
	Landing: undefined;
	SkillsHome: undefined;
	SkillScreen: undefined;
};

export type ChainParamList = {
	SkillScreen: undefined;
	PrepareMaterials: undefined;
	BaselineAssessment: undefined;
	Reward: undefined;
	Step: undefined;
	TipsTricks: undefined;
};

export type ChainNavProps<T extends keyof ChainParamList> = {
	navigation: StackNavigationProp<ChainParamList, T>;
	route: RouteProp<ChainParamList, T>;
};

export type LandingProps = StackScreenProps<RootStackParamList, "Landing">;
export type SkillHomeProps = StackScreenProps<RootStackParamList, "SkillsHome">;
export type SkillScreenProps = StackScreenProps<
	RootStackParamList,
	"SkillScreen"
>;
