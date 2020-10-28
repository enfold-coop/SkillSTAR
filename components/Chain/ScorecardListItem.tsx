import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

type Props = {
	id: string;
	title: string;
	score: number;
};

const ScorecardListItem: FC<Props> = (props) => {
	const { id, title, score } = props.item;
	console.log(title);

	return (
		<Card style={styles.container}>
			<Text style={styles.id}>{id}</Text>
			<Text style={styles.skill}>Skill: {title}</Text>
			<Text style={styles.icon}>Mastered: {score}</Text>
		</Card>
	);
};

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

export default ScorecardListItem;
