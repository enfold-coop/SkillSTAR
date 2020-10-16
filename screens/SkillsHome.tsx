import * as React from "react";
import { StyleSheet } from "react-native";
import { RootNavProps as Props } from "../types";

import { View } from "../components/Themed";

import { SkillsList } from "../components/SkillsHome";

export default function SkillsHome({ navigation, route }: Props<"SkillsHome">) {
	return (
		<View style={styles.container}>
			<SkillsList />
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
