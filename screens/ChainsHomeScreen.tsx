import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootNavProps } from "../navigation/root_types";
import { ScorecardList } from "../components/Chain/index";

export default function ChainsHomeScreen({
	navigation,
	route,
}: RootNavProps<"ChainsHomeScreen">) {
	// const { thisSkill } = route.params;
	// const [data, setData] = useState();

	// useEffect(() => {
	// 	navigation.setOptions({ title: skill });
	// });

	return (
		<View style={styles.container}>
			<Text>CHAINS HOME</Text>
			{/* <Text>{thisSkill}</Text>
			<Text style={styles.title}>Scorecard</Text>
			<ScorecardList data={data} /> */}
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
