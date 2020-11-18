import React, { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { RootNavProps as Props } from "../navigation/root_types";
import { SkillsList } from "../components/SkillsHome";
import AppHeader from "../components/Header/AppHeader";
import { DUMMY_SKILLS_ARR } from "../data/DUMMYDATA";

const SkillsHomeScreen: FC<Props<"SkillsHomeScreen">> = ({
	navigation,
	route,
}) => {
	return (
		<View style={styles.container}>
			<AppHeader name={"Skills Home"} />
			{DUMMY_SKILLS_ARR && <SkillsList data={DUMMY_SKILLS_ARR} />}
		</View>
	);
};

export default SkillsHomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
	},
});
