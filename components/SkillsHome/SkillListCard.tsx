import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Card } from "react-native-paper";
import { RootNavProps } from "../../navigation/root_types";

import { SkillGrade } from "./index";

export default function SkillListCard({
	navigation,
	route,
}: RootNavProps<"SkillsHomeScreen">) {
	// console.log("skill list card");
	// console.log(props);
	return (
		<Card style={styles.container}>
			<Text style={styles.title}>Skill ScoreCard (placeholder)</Text>
			<View style={styles.subcontainer}>
				<SkillGrade />
				<SkillGrade />
				<SkillGrade />
				<SkillGrade />
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
		padding: 20,
		margin: 10,
		flex: 1,
		flexDirection: "column",
		borderWidth: 5,
		borderColor: "#dcff16",
	},
	title: {
		padding: 10,
		fontSize: 20,
		fontWeight: "bold",
	},
	subcontainer: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
	},
	skillComponent: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
		padding: 80,
		paddingTop: 40,
		paddingBottom: 40,
		margin: 10,
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 5,
	},
});
