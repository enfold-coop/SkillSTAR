import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { RootNavProps as Props } from "../_types/RootNav";
import SkillsList from '../components/SkillsHome/SkillsList';
import { DUMMY_SKILLS_ARR } from "../data/DUMMYDATA";

export default function SkillsHomeScreen({
	navigation,
	route,
}: Props<"SkillsHomeScreen">) {
	return (
		<View style={styles.container}>
			<Text>SKILLS SCREEN</Text>
			<SkillsList data={DUMMY_SKILLS_ARR} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
