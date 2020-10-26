import React from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { SkillListCard } from "./index";
import { RootNavProps as Props } from "../../navigation/root_types";

export default function SkillsList(data: Props<"SkillsHomeScreen">) {
	console.log(data);

	return (
		<ScrollView>
			<View style={styles.container}>
				<Text style={styles.title}>SKILLS LIST</Text>
				{/* {
                    array.forEach(element => {
                        
                    });
                } */}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
		backgroundColor: "#bbb",
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: "900",
		color: "#b72ef2",
	},
});
