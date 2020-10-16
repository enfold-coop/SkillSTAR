import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChainNavProps } from "../../types";

import { SkillsList } from "../../components/SkillsHome";

export default function SkillScreen({
	navigation,
}: ChainNavProps<"SkillScreen">) {
	return (
		<View style={styles.container}>
			<Text>SKILL SCREEN</Text>
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
