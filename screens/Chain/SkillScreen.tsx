import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootNavProps } from "../../types";

import { SkillsList } from "../../components/SkillsHome";

export default function SkillScreen({
	navigation,
	route,
}: RootNavProps<"SkillScreen">) {
	const { thisSkill } = route.params;
	// console.log(thisSkill);
	navigation.setOptions({ title: thisSkill });
	return (
		<View style={styles.container}>
			<Text>{thisSkill}</Text>
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
