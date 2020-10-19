import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ScorecardListItem(props) {
	console.log(props);
	const { id, skill, mastered } = props.data;

	return (
		<View>
			<Text>{id}</Text>
			<Text>Skill: {skill}</Text>
			<Text>Mastered: {mastered}</Text>
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
