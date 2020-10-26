import React from "react";
import { ScrollView, View, Text, FlatList, StyleSheet } from "react-native";
import { ScorecardListItem } from "./index";

//
// BEGIN :: DUMMY DATA
/**
 * 0 = not started
 * 1 = not mastered
 * 2 = mastered
 */
interface DUMMYDATAITEM {
	id: number;
	skill: string;
	mastered: number;
}

let DUMMYARR: DUMMYDATAITEM[] = [
	{
		id: 1,
		skill: "A",
		mastered: 0,
	},
	{
		id: 2,
		skill: "B",
		mastered: 1,
	},
	{
		id: 3,
		skill: "C",
		mastered: 2,
	},
	{
		id: 4,
		skill: "D",
		mastered: 2,
	},
];

DUMMYARR.forEach((e, i) => {
	let item: DUMMYDATAITEM = {
		id: e.id,
		skill: e.skill,
		mastered: e.mastered,
	};
	DUMMYARR[i] = item;
});

// END :: DUMMY DATA
//

export default function ScorecardItemList(props) {
	// console.log("scorecard list");
	// console.log(props);

	return (
		<View>
			<Text>Scorecard Item List ...</Text>
			<FlatList
				data={DUMMYARR}
				keyExtractor={(item) => item.skill}
				renderItem={({ item }) => <ScorecardListItem data={item} />}
			/>
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
