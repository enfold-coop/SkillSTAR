import * as React from "react";
import { StyleSheet } from "react-native";
import { RootNavProps as Props } from "../navigation/root_types";

import { View } from "../components/Themed";

import { SkillsList } from "../components/SkillsHome/index";
import { DUMMY_SKILLS_ARR } from "../components/SkillsHome/DUMMYDATA";

export default function SkillsHomeScreen({
	navigation,
	route,
}: Props<"SkillsHomeScreen">) {
	console.log(DUMMY_SKILLS_ARR);

	return (
		<View style={styles.container}>
			<SkillsList data={DUMMY_SKILLS_ARR} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		//
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
