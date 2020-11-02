import React, { FC, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Card } from "react-native-paper";
import {ListCardProps, SkillDataItem, SkillSubItem} from '../../_interfaces/Skill';
import { ChainContext } from "../../context/ChainProvider";
import SkillGrade from './SkillGrade';
// import {
// 	ChainStack,
// 	ChainNavigator,
// } from "../../navigation/ChainNavigation/ChainNavStack";
// import { ChainContext, ChainProvider } from "../../context/ChainProvider";

function filterSkillByScore(arr: SkillSubItem[], score: number) {
	return arr.filter((e) => e.score === score);
}

const SkillListCard: FC<ListCardProps> = (props) => {
	const navigation = useNavigation();
	const { setChainSkill } = useContext(ChainContext);

	const { subItems } = props.dataItem.item;

	const mastered = filterSkillByScore(subItems, 1);
	const inProgress = filterSkillByScore(subItems, 0);
	const needsSupport = filterSkillByScore(subItems, 2);

	// passing selected skill to ChainProvider (CHAIN's state management)
	// calls Navigate(), to navigate to ChainsHomeScreen
	function SetContextSkill() {
		setChainSkill(props.dataItem);
		Navigate();
	}

	function Navigate() {
		navigation.navigate("ChainsHomeScreen");
	}

	return (
		<Card style={styles.container}>
			<Text style={styles.title}>Skill ScoreCard x</Text>
			<View style={styles.subcontainer}>
				<SkillGrade data={mastered} name={"Mastered"} />
				<SkillGrade data={inProgress} name={"In Progress"} />
				<SkillGrade data={needsSupport} name={"Needs Support"} />
			</View>

			<Button
				style={styles.button}
				mode="contained"
				onPress={() => SetContextSkill()}
			>
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
		// padding: 10,
		margin: 10,
	},
	title: {
		padding: 10,
		fontSize: 20,
		fontWeight: "bold",
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
