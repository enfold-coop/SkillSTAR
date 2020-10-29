import React, { FC, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ScorecardListItem } from "./index";

type ScorecardListProps = {
	data: [];
};

const ScorecardList: FC<ScorecardListProps> = (props) => {
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
};

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

export default ScorecardList;
