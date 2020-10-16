import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootNavProps } from "../../types";

export default function SkillScreen({
	navigation,
	route,
}: RootNavProps<"SkillScreen">) {
	const { thisSkill } = route.params;

	useEffect(() => {
		navigation.setOptions({ title: thisSkill });
	});

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
