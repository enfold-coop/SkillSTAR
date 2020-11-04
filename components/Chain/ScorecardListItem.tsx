import React, { FC } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";
import { MasteryIcons } from "../../styles/MasteryIcons";
import { AntDesign } from "@expo/vector-icons";

type Props = {
	id: string;
	title: string;
	score: number;
};

const ScorecardListItem: FC<Props> = (props) => {
	const navigation = useNavigation();
	const { id, title, score } = props.item.item;
	// console.log(props);

	return (
		<Card style={styles.container}>
			<TouchableOpacity
				style={styles.touchable}
				onPress={() => {
					navigation.navigate("PrepareMaterialsScreen");
				}}
			>
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
