import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { SkillListCard } from "./index";
import { RootNavProps as Props } from "../../navigation/root_types";

export default function SkillsList({
	data,
	navigation,
	route,
}: Props<"SkillsHomeScreen">) {
	return (
		<View>
			<View style={styles.container}>
				<Text style={styles.title}>SKILLS LIST</Text>
				<FlatList
					data={data}
					keyExtractor={(index) => index.toString()}
					renderItem={(item) => <SkillListCard dataItem={item} />}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
		backgroundColor: "#bbb",
		padding: 20,
		margin: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: "900",
		color: "#b72ef2",
	},
});
