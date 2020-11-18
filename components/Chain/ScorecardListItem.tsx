import React, { FC } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { MasteryIcons } from "../../styles/MasteryIcons";
import { AntDesign } from "@expo/vector-icons";

type ListItem = {};
type Props = {
	itemProps: ListItem;
};

const ScorecardListItem: FC<Props> = ({ ...props }) => {
	const { step, instruction, mastery } = props.itemProps.item;

	return (
		<Card style={styles.container}>
			<TouchableOpacity style={styles.touchable}>
				<Text style={styles.id}>{step}. </Text>
				<Text style={styles.skill}>{instruction}</Text>
				<Text style={styles.score}>{MasteryIcons(mastery)}</Text>
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
		marginBottom: 3,
	},
	touchable: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
	},
	id: {
		padding: 5,
		fontSize: 14,
		fontWeight: "bold",
	},
	skill: {
		width: 300,
		flexWrap: "wrap",
		padding: 5,
		fontSize: 14,
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
