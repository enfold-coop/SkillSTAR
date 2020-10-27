import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Card } from "react-native-paper";
import { RootNavProps } from "../../navigation/root_types";

import { SkillGrade } from "./index";

function filterSkillByScore(arr, score) {
	let temp = [];
	arr.forEach((e) => {
		if (e.score === score) {
			temp.push(e);
		}
	});
	return temp;
}

export default function SkillListCard({
	navigation,
	route,
	dataItem,
}: RootNavProps<"SkillsHomeScreen">) {
	// console.log("skill list card");
	// console.log(dataItem.item);

	const { name, subItems } = dataItem.item;
	let mastered = filterSkillByScore(subItems, 1);
	let inProgress = filterSkillByScore(subItems, 0);
	let needsSupport = filterSkillByScore(subItems, 2);

	return (
		<Card style={styles.container}>
			<Text style={styles.title}>Skill ScoreCard x</Text>
			<View style={styles.subcontainer}>
				<SkillGrade data={mastered} name={"Mastered"} />
				<SkillGrade data={inProgress} name={"In Progress"} />
				<SkillGrade data={needsSupport} name={"Needs Support"} />
			</View>
			<Button
				mode="contained"
				onPress={() => navigation.navigate("ChainsHomeScreen")}
			>
				Go To Skill
			</Button>
		</Card>
	);
}

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