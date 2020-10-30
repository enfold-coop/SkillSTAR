import React, { FC, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ScorecardListItem } from "./index";

type Props = {
	name: string;
	subItems: {}[];
};

const ScorecardList: FC<Props> = (props) => {
	console.log(props);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Scorecard Item List ...</Text>
			<FlatList
				data={subItems}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <ScorecardListItem item={item} />}
			/>
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
