import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function ScorecardListItem(props) {
	const { id, skill, mastered } = props.data;

	return (
		<Card style={styles.container}>
			<Text style={styles.id}>{id}</Text>
			<Text style={styles.skill}>Skill: {skill}</Text>
			<Text style={styles.icon}>Mastered: {mastered}</Text>
		</Card>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
	},
	id: {
		fontSize: 20,
		fontWeight: "bold",
	},
	skill: {
		fontSize: 20,
		fontWeight: "bold",
	},
	icon: {},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
