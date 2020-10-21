import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootNavProps } from "../navigation/rootStackPropTypes";
import { ScorecardItemList } from "../components/Chain/index";

export default function ScoreCardScreen({
	navigation,
	route,
}: RootNavProps<"ScoreCardScreen">) {
	const { thisSkill } = route.params;
	// console.log("scorecardscreen");
	// console.log(navigation);

	useEffect(() => {
		navigation.setOptions({ title: thisSkill });
	});

	return (
		<View style={styles.container}>
			<Text>{thisSkill}</Text>
			<Text style={styles.title}>Scorecard</Text>
			<ScorecardItemList />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
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
