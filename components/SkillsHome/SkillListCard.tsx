import React, { FC, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Card } from "react-native-paper";
import { ChainNavProps } from "../../navigation/ChainNavigation/types";
// import {
// 	ChainStack,
// 	ChainNavigator,
// } from "../../navigation/ChainNavigation/ChainNavStack";
// import { ChainContext, ChainProvider } from "../../context/ChainProvider";

import { SkillGrade } from "./index";

type Item = {
	name: string;
	subItems: {}[];
};

type ListCardProps = {
	dataItem: Item;
	route: ChainNavProps<"ChainsHomeScreen">;
	navigation: ChainNavProps<"ChainsHomeScreen">;
};

function filterSkillByScore(arr: [], score: number) {
	let temp: [] = [];
	arr.forEach((e) => {
		if (e.score === score) {
			temp.push(e);
		}
	});
	return temp;
}

const SkillListCard: FC<ListCardProps> = (props) => {
	const navigation = useNavigation();
	// KEEP >>
	// const chainContext = useContext(ChainContext);
	// <<
	const { subItems } = props.dataItem.item;

	let mastered = filterSkillByScore(subItems, 1);
	let inProgress = filterSkillByScore(subItems, 0);
	let needsSupport = filterSkillByScore(subItems, 2);

	function SetContextSkill() {
		//
		// --- Here... send selected skill to Context API
		//
		navigation.navigate("ChainsHomeScreen", { skill: props.dataItem });
	}

	return (
		<Card style={styles.container}>
			<Text style={styles.title}>Skill ScoreCard x</Text>
			<View style={styles.subcontainer}>
				<SkillGrade data={mastered} name={"Mastered"} />
				<SkillGrade data={inProgress} name={"In Progress"} />
				<SkillGrade data={needsSupport} name={"Needs Support"} />
			</View>

			<Button mode="contained" onPress={() => SetContextSkill()}>
				Go to Skill
			</Button>
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		borderWidth: 5,
		borderColor: "#dcff16",
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 10,
		margin: 10,
	},
	title: {
		padding: 10,
		fontSize: 20,
		fontWeight: "bold",
	},
	subcontainer: {
		// margin: 20,
		// padding: 20,
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
	},
	// skillComponent: {
	// 	display: "flex",
	// 	flexDirection: "row",
	// 	flexWrap: "wrap",
	// 	justifyContent: "flex-start",
	// 	padding: 80,
	// 	paddingTop: 40,
	// 	paddingBottom: 40,
	// 	margin: 10,
	// 	borderWidth: 1,
	// 	borderColor: "#fff",
	// 	borderRadius: 5,
	// },
});

export default SkillListCard;
