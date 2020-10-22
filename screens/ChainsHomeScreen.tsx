import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootNavProps } from "../navigation/root_types";
import { ScorecardItemList } from "../components/Chain/index";

export interface DUMMYDATAITEM {
	id: number;
	skill: string;
	mastered: number;
}

export const DUMMYARR: DUMMYDATAITEM[] = [
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

function FetchDummyData(): DUMMYDATAITEM[] {
	DUMMYARR.forEach((e, i) => {
		let item: DUMMYDATAITEM = {
			id: e.id,
			skill: e.skill,
			mastered: e.mastered,
		};
		DUMMYARR[i] = item;
	});
	return DUMMYARR;
}

export default function ChainsHomeScreen({
	navigation,
	route,
}: RootNavProps<"ChainsHomeScreen">) {
	const { thisSkill } = route.params;
	const [data, setData] = useState();

	useEffect(() => {
		navigation.setOptions({ title: thisSkill });
		FetchDummyData();
	});

	// MOCK API CALL
	useEffect(() => {
		let d = FetchDummyData();
		setData(d);
		console.log("data fetched from api");
		console.log(data);
	});

	return (
		<View style={styles.container}>
			<Text>{thisSkill}</Text>
			<Text style={styles.title}>Scorecard</Text>
			<ScorecardItemList data={data} />
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
