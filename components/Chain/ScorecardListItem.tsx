import React, { FC } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";

type Props = {
	id: string;
	title: string;
	score: number;
};

const ScorecardListItem: FC<Props> = (props) => {
	const { id, title, score } = props.item.item;

	return (
		<Card style={styles.container}>
			<TouchableOpacity style={styles.touchable}>
				<Text style={styles.id}>Skill {id}: </Text>
				<Text style={styles.skill}>{title}</Text>
				<Text style={styles.icon}>Mastered: {score}</Text>
				<Text style={styles.nextIcon}>NXT</Text>
			</TouchableOpacity>
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 3,
	},
	touchable: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		width: "90vw",
		paddingTop: 10,
		paddingBottom: 10,
	},
	id: {
		padding: 5,
		fontSize: 20,
		fontWeight: "bold",
	},
	skill: {
		padding: 5,
		fontSize: 20,
		fontWeight: "bold",
	},
	icon: {},
	nextIcon: {
		marginRight: 0,
		alignSelf: "flex-end",
		backgroundColor: "#da0",
	},

	title: {
		padding: 5,
		fontSize: 20,
		fontWeight: "bold",
	},
});

export default ScorecardListItem;
