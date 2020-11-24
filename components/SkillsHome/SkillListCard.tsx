import React, { FC, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Card } from "react-native-paper";
import { RootNavProps } from "../../navigation/root_types";
import CustomColors from "../../styles/Colors";
import { Context } from "../../context/Provider";
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
	route: RootNavProps<"ChainsHomeScreen">;
	navigation: RootNavProps<"ChainsHomeScreen">;
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

	const { subItems, name } = props.dataItem.item;

	let mastered = filterSkillByScore(subItems, 1);
	let inProgress = filterSkillByScore(subItems, 0);
	let needsSupport = filterSkillByScore(subItems, 2);

	return (
		<Card style={styles.container}>
			{/* <Text style={styles.skillName}>{name}</Text>
			<View style={styles.subcontainer}>
				<SkillGrade data={mastered} name={"Mastered"} />
				<SkillGrade data={inProgress} name={"In Progress"} />
				<SkillGrade data={needsSupport} name={"Needs Support"} />
			</View>

			<Button
				style={styles.button}
				color={CustomColors.uva.blue}
				mode="contained"
				onPress={() =>
					navigation.navigate("ChainsHomeScreen", {
						skill: props.dataItem.item,
					})
				}
			>
				Go to Skill
			</Button> */}
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		margin: 5,
	},
	skillName: {
		padding: 10,
		paddingLeft: 20,
		fontSize: 20,
		fontWeight: "800",
	},
	subcontainer: {
		margin: 20,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	button: {
		margin: 20,
	},
});

export default SkillListCard;
