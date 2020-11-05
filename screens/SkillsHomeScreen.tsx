import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { RootNavProps as Props } from "../navigation/root_types";
import { SkillsList } from "../components/SkillsHome/index";
import AppHeader from "../components/Header/AppHeader";
import { DUMMY_SKILLS_ARR } from "../data/DUMMYDATA";

export default function SkillsHomeScreen({
	navigation,
	route,
}: Props<"SkillsHomeScreen">) {
	return (
		<View style={styles.container}>
			<AppHeader name={"Skills Home"} />
			<SkillsList data={DUMMY_SKILLS_ARR} />
		</View>
	);
}

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
