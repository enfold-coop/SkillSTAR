import React, { useEffect } from "react";
import { ScrollView, View, Text, FlatList, StyleSheet } from "react-native";
import { ScorecardListItem } from "./index";

export default function ScorecardList(props) {
	// let data = null;

	// useEffect(() => {
	// 	data = props.data;
	// 	console.log(data);
	// });

	return (
		<View>
			<Text>Scorecard Item List ...</Text>
			{props.data != undefined && (
				<FlatList
					data={props.data}
					keyExtractor={(item) => item.skill}
					renderItem={({ item }) => <ScorecardListItem data={item} />}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
