import React from "react";
import { ScrollView, View, Text, FlatList, StyleSheet } from "react-native";
import { ScorecardListItem } from "./index";

// BEGIN :: DUMMY DATA
const DUMMYDATA = {};
// END :: DUMMY DATA
const;

export default function ScorecardItemList() {
	return (
		<View>
			<Text>Scorecard Item List ...</Text>
			<FlatList data={[{ key: "" }]} />
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
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
