import React, { FC } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import {ScorecardItem, ScorecardListRenderItemInfo} from '../../_interfaces/Scorecard';
import { MasteryIcons } from "../../styles/MasteryIcons";
import { AntDesign } from "@expo/vector-icons";

const ScorecardListItem: FC<ScorecardListRenderItemInfo> = (props) => {
	const { id, title, score } = props.item;

	return (
		<Card style={styles.container}>
			<TouchableOpacity style={styles.touchable}>
				<Text style={styles.id}>Skill {id}: </Text>
				<Text style={styles.skill}>{title}</Text>
				<Text style={styles.score}>{MasteryIcons(score)}</Text>
				<AntDesign
					name="caretright"
					size={24}
					color="black"
					style={styles.nextIcon}
				/>
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
		width: "90%",
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
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
	score: {
		paddingLeft: 20,
	},
	nextIcon: {
		marginLeft: "auto",
		padding: 10,
		paddingRight: 20,
	},

	title: {
		padding: 5,
		fontSize: 20,
		fontWeight: "bold",
	},
});

export default ScorecardListItem;
