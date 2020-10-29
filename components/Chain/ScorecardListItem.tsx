import React, { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";

type Props = {
	id: string;
	title: string;
	score: number;
};

const ScorecardListItem: FC<Props> = (props) => {
	const { id, title, score } = props.item;

	return (
		<TouchableOpacity>
			<Card style={styles.container}>
				<Text style={styles.id}>{id}</Text>
				<Text style={styles.skill}>Skill: {title}</Text>
				<Text style={styles.icon}>Mastered: {score}</Text>
			</Card>
		</TouchableOpacity>
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
