import React, { FC } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";
import { MasteryIcons } from "../../styles/MasteryIcons";
import { AntDesign } from "@expo/vector-icons";

type Props = {
	attemps: {}[];
	instruction: string;
	mastered: number;
	step: number;
	video: string;
};

function Touchable(step: {}) {
	/**
	 * - determine level of mastery,
	 * - get corresponding icon for mastery level
	 * - return element with icon and info
	 */
	return (
		<TouchableOpacity
			style={styles.touchable}
			onPress={() => {
				navigation.navigate("PrepareMaterialsScreen");
			}}
		>
			<Text style={styles.id}>{step.item.step}. </Text>
			<Text style={styles.skill}>{step.item.instruction}</Text>
			<Text style={styles.score}>{MasteryIcons(step.item.mastery)}</Text>
			<AntDesign
				name="caretright"
				size={24}
				color="black"
				style={styles.nextIcon}
			/>
		</TouchableOpacity>
	);
}

const ScorecardListItem: FC<Props> = (props) => {
	// console.log(props);
	const navigation = useNavigation();

	return <Card style={styles.container}>{Touchable(props.item)}</Card>;
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
